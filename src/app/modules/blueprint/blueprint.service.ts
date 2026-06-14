// src/modules/blueprint/blueprint.service.ts

import { Pinecone, type RecordMetadata } from '@pinecone-database/pinecone';
import httpStatus from 'http-status';
import OpenAI from 'openai';
import AppError from '../../error/appError';
import { INormalUser } from '../normalUser/normalUser.interface';
import {
  IBlueprint,
  IBlueprintDocument,
  IBlueprintGenerationResult,
  INutritionStrategy,
  IProgressionStrategy,
  IRagChunkMetadata,
  IRecoveryStrategy,
  IWeeklyPhase,
  IWeeklyScheduleDay,
} from './blueprint.interface';
import { Blueprint } from './blueprint.model';
import { buildBlueprintPrompt } from './blueprint.prompt';

// ── Constants ────────────────────────────────────────────────────────────────

const EMBEDDING_MODEL = 'text-embedding-3-small';
const COMPLETION_MODEL = 'gpt-4o';
const RAG_TOP_K = 8;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const VALID_GOALS = new Set([
  'muscle_gain',
  'strength',
  'fat_loss',
  'endurance',
  'general_fitness',
  'athletic_performance',
  'weight_loss',
]);
const VALID_PHASES = new Set([
  'Accumulation',
  'Intensification',
  'Deload',
  'Peak',
]);
const VALID_WORKOUT_TYPES = new Set([
  'Upper Body',
  'Lower Body',
  'Full Body',
  'Conditioning',
  'Active Recovery',
  'Rest',
]);
const VALID_PROGRESSION_TYPES = new Set([
  'Linear',
  'Wave',
  'Step',
  'Undulating',
  'Block',
]);

// ── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Maps user fitness goal to KILO knowledge base goal tags.
 * Ensures the RAG query targets the most relevant chunks.
 */
const mapFitnessGoalToKiloGoal = (fitnessGoal: string): string => {
  const mapping: Record<string, string> = {
    muscle_gain: 'hypertrophy functional_hypertrophy',
    strength: 'relative_strength absolute_strength',
    fat_loss: 'hypertrophy strength_endurance',
    endurance: 'strength_endurance',
    general_fitness: 'hypertrophy all',
    athletic_performance: 'power functional_hypertrophy relative_strength',
    weight_loss: 'strength_endurance hypertrophy',
  };
  return mapping[fitnessGoal] ?? 'all';
};

/**
 * Builds a rich semantic query for Pinecone that captures the user's
 * full training context — goal, level, frequency, and phase signals.
 */
const buildRagQuery = (user: INormalUser): string => {
  const kiloGoal = mapFitnessGoalToKiloGoal(user.fitnessGoal);
  const phase =
    user.experienceLevel === 'beginner' ? 'accumulation' : 'both phases';

  return [
    `Training program design for ${user.experienceLevel} lifter`,
    `Goal: ${kiloGoal}`,
    `Training frequency: ${user.daysPerWeek} days per week`,
    `Phase: ${phase}`,
    `Rep schemes, session structure, microcycle layout`,
    `Warm-up protocol`,
    `Exercise selection based on ${user.availableEquipment?.join(', ') ?? 'standard equipment'}`,
  ].join('. ');
};

/**
 * Strips Pinecone metadata into clean text blocks for the LLM prompt.
 */
const formatRagContext = (
  matches: Array<{ metadata?: IRagChunkMetadata & RecordMetadata }>,
): string => {
  if (!matches.length) return 'No specific knowledge base context found.';

  return matches
    .map((match, i) => {
      const meta = match.metadata;
      if (!meta?.text) return null;
      return [
        `--- Knowledge Chunk ${i + 1} [${meta.topic ?? 'general'}] ---`,
        meta.text,
      ].join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
};

// ── RAG Retrieval ─────────────────────────────────────────────────────────────

/**
 * Embeds the semantic query and retrieves the top-K relevant chunks
 * from the Pinecone vector store. Applies a metadata filter when
 * user level is beginner to avoid returning advanced-only schemes.
 */
const retrieveRagContext = async (
  user: INormalUser,
  openai: OpenAI,
  pinecone: Pinecone,
): Promise<string> => {
  const indexName = process.env.PINECONE_INDEX_NAME;
  if (!indexName) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'PINECONE_INDEX_NAME environment variable is not set',
    );
  }

  const queryText = buildRagQuery(user);

  const embeddingResponse = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: queryText,
  });

  const queryVector = embeddingResponse.data[0].embedding;

  // Beginners only get chunks tagged beginner or all — no advanced-only schemes
  const filter =
    user.experienceLevel === 'beginner'
      ? { level: { $in: ['beginner', 'all'] } }
      : undefined;

  const index = pinecone.index<IRagChunkMetadata & RecordMetadata>(indexName);

  const queryResponse = await index.query({
    vector: queryVector,
    topK: RAG_TOP_K,
    includeMetadata: true,
    ...(filter && { filter }),
  });

  return formatRagContext(queryResponse.matches ?? []);
};

// ── Validation ────────────────────────────────────────────────────────────────

/**
 * Deep-validates every field of the generated blueprint against the
 * STRICT_BLUEPRINT_SCHEMA rules declared in blueprint.prompt.ts.
 *
 * Throws a descriptive AppError for the first violation found so the
 * retry loop can attempt generation again before giving up.
 */
const validateBlueprintShape = (raw: unknown, daysPerWeek: number): void => {
  const b = raw as Partial<IBlueprint>;

  // ── Top-level required keys ──────────────────────────────────────────────
  const topLevelRequired: Array<keyof IBlueprint> = [
    'goal',
    'durationDays',
    'weeklyPhases',
    'nutritionStrategy',
    'progressionStrategy',
    'recoveryStrategy',
    'weeklySchedule',
  ];

  for (const key of topLevelRequired) {
    if (b[key] === undefined || b[key] === null) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: missing required field "${key}"`,
      );
    }
  }

  // ── goal ─────────────────────────────────────────────────────────────────
  if (typeof b.goal !== 'string' || !VALID_GOALS.has(b.goal)) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Blueprint validation failed: "goal" must be one of [${[...VALID_GOALS].join(', ')}], got "${b.goal}"`,
    );
  }

  // ── durationDays ─────────────────────────────────────────────────────────
  if (b.durationDays !== 30) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Blueprint validation failed: "durationDays" must be exactly 30, got ${b.durationDays}`,
    );
  }

  // ── weeklyPhases — exactly 4 items ────────────────────────────────────────
  if (!Array.isArray(b.weeklyPhases) || b.weeklyPhases.length !== 4) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Blueprint validation failed: "weeklyPhases" must have exactly 4 items, got ${Array.isArray(b.weeklyPhases) ? b.weeklyPhases.length : typeof b.weeklyPhases}`,
    );
  }

  b.weeklyPhases.forEach((phase: IWeeklyPhase, i: number) => {
    const prefix = `weeklyPhases[${i}]`;

    if (phase.week !== i + 1) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: ${prefix}.week must be ${i + 1}, got ${phase.week}`,
      );
    }
    if (!VALID_PHASES.has(phase.phase)) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: ${prefix}.phase must be one of [${[...VALID_PHASES].join(', ')}], got "${phase.phase}"`,
      );
    }
    if (typeof phase.objective !== 'string' || !phase.objective.trim()) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: ${prefix}.objective must be a non-empty string`,
      );
    }
    if (
      typeof phase.intensity !== 'number' ||
      !Number.isInteger(phase.intensity) ||
      phase.intensity < 1 ||
      phase.intensity > 10
    ) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: ${prefix}.intensity must be an integer 1–10, got ${phase.intensity}`,
      );
    }
  });

  // ── nutritionStrategy ────────────────────────────────────────────────────
  const ns = b.nutritionStrategy as Partial<INutritionStrategy>;
  const nutritionIntegerFields: Array<keyof INutritionStrategy> = [
    'targetCalories',
    'targetProtein',
    'targetCarbs',
    'targetFat',
  ];

  for (const field of nutritionIntegerFields) {
    const val = ns[field];
    if (typeof val !== 'number' || !Number.isInteger(val) || val <= 0) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: nutritionStrategy.${field} must be a positive integer, got ${val}`,
      );
    }
  }

  if (
    typeof ns.hydrationTargetLiters !== 'number' ||
    ns.hydrationTargetLiters <= 0
  ) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Blueprint validation failed: nutritionStrategy.hydrationTargetLiters must be a positive number, got ${ns.hydrationTargetLiters}`,
    );
  }

  // ── progressionStrategy ──────────────────────────────────────────────────
  const ps = b.progressionStrategy as Partial<IProgressionStrategy>;

  if (!VALID_PROGRESSION_TYPES.has(ps.type ?? '')) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Blueprint validation failed: progressionStrategy.type must be one of [${[...VALID_PROGRESSION_TYPES].join(', ')}], got "${ps.type}"`,
    );
  }
  if (typeof ps.description !== 'string' || !ps.description.trim()) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Blueprint validation failed: progressionStrategy.description must be a non-empty string',
    );
  }

  // ── recoveryStrategy ─────────────────────────────────────────────────────
  const rs = b.recoveryStrategy as Partial<IRecoveryStrategy>;

  if (
    typeof rs.sleepTargetHours !== 'number' ||
    rs.sleepTargetHours < 7 ||
    rs.sleepTargetHours > 9
  ) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Blueprint validation failed: recoveryStrategy.sleepTargetHours must be between 7 and 9, got ${rs.sleepTargetHours}`,
    );
  }
  if (
    typeof rs.restDaysPerWeek !== 'number' ||
    rs.restDaysPerWeek < 1 ||
    rs.restDaysPerWeek > 5
  ) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Blueprint validation failed: recoveryStrategy.restDaysPerWeek must be between 1 and 5, got ${rs.restDaysPerWeek}`,
    );
  }

  // ── weeklySchedule — exactly 7 items ──────────────────────────────────────
  if (!Array.isArray(b.weeklySchedule) || b.weeklySchedule.length !== 7) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Blueprint validation failed: "weeklySchedule" must have exactly 7 items (one per day), got ${Array.isArray(b.weeklySchedule) ? b.weeklySchedule.length : typeof b.weeklySchedule}`,
    );
  }

  let actualWorkoutDays = 0;

  b.weeklySchedule.forEach((day: IWeeklyScheduleDay, i: number) => {
    const prefix = `weeklySchedule[${i}]`;

    if (day.dayOfWeek !== i + 1) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: ${prefix}.dayOfWeek must be ${i + 1}, got ${day.dayOfWeek}`,
      );
    }
    if (!VALID_WORKOUT_TYPES.has(day.workoutType)) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: ${prefix}.workoutType must be one of [${[...VALID_WORKOUT_TYPES].join(', ')}], got "${day.workoutType}"`,
      );
    }
    if (typeof day.focus !== 'string' || !day.focus.trim()) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: ${prefix}.focus must be a non-empty string`,
      );
    }
    if (typeof day.isWorkoutDay !== 'boolean') {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: ${prefix}.isWorkoutDay must be a boolean, got ${typeof day.isWorkoutDay}`,
      );
    }
    // Rest days must consistently use workoutType "Rest"
    if (!day.isWorkoutDay && day.workoutType !== 'Rest') {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Blueprint validation failed: ${prefix} has isWorkoutDay=false but workoutType="${day.workoutType}" (must be "Rest")`,
      );
    }

    if (day.isWorkoutDay) actualWorkoutDays++;
  });

  // Workout day count must match user's daysPerWeek
  if (actualWorkoutDays !== daysPerWeek) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Blueprint validation failed: weeklySchedule has ${actualWorkoutDays} workout days but user requested ${daysPerWeek}`,
    );
  }
};

// ── LLM Generation ────────────────────────────────────────────────────────────

/**
 * Calls OpenAI with the enriched prompt and parses + validates the response.
 *
 * The system message is intentionally minimal — all instructions, schema,
 * constraints, and context live in the user message built by buildBlueprintPrompt.
 * This prevents the system message from diluting or contradicting the prompt.
 *
 * Retries up to MAX_RETRIES on:
 *   - JSON parse errors (SyntaxError)
 *   - Validation errors (AppError from validateBlueprintShape)
 *   - OpenAI rate limits (429)
 *   - OpenAI server errors (500)
 */
const generateBlueprintFromLLM = async (
  user: INormalUser,
  ragContext: string,
  openai: OpenAI,
): Promise<IBlueprint> => {
  const prompt = buildBlueprintPrompt(user, ragContext);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: COMPLETION_MODEL,
        temperature: 0.3,
        max_tokens: 4096,
        // json_object mode guarantees valid JSON is returned —
        // eliminates the need to strip markdown fences in most cases
        response_format: { type: 'json_object' },
        messages: [
          {
            // Minimal system message — role framing only.
            // All schema, rules, and constraints are in the user message
            // via buildBlueprintPrompt so nothing conflicts.
            role: 'system',
            content:
              'You are an elite strength coach and sports nutritionist. ' +
              'Respond with valid JSON only. No markdown. No explanation.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const rawContent = response.choices[0]?.message?.content;

      if (!rawContent) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'OpenAI returned an empty response',
        );
      }

      // Defensive strip — json_object mode should prevent fences
      // but guard against edge cases
      const cleaned = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const parsed: unknown = JSON.parse(cleaned);

      // Deep validation against STRICT_BLUEPRINT_SCHEMA rules
      validateBlueprintShape(parsed, user.daysPerWeek);

      return parsed as IBlueprint;
    } catch (error) {
      lastError = error as Error;

      const isRetryable =
        error instanceof SyntaxError || // JSON parse failure
        error instanceof AppError || // schema validation failure
        (error as { status?: number }).status === 429 || // rate limit
        (error as { status?: number }).status === 500; // OpenAI server error

      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt;
        console.warn(
          `[Blueprint] Attempt ${attempt}/${MAX_RETRIES} failed — retrying in ${delay}ms.`,
          `Reason: ${lastError.message}`,
        );
        await sleep(delay);
        continue;
      }

      break;
    }
  }

  throw new AppError(
    httpStatus.INTERNAL_SERVER_ERROR,
    `Blueprint generation failed after ${MAX_RETRIES} attempts: ${lastError?.message ?? 'Unknown error'}`,
  );
};


/**
 * Full blueprint generation pipeline:
 *
 *  1. Validate environment variables
 *  2. Instantiate OpenAI + Pinecone clients (per-request — no shared state)
 *  3. Retrieve RAG context from Pinecone (semantic search + metadata filter)
 *  4. Build prompt via buildBlueprintPrompt (user profile + RAG + strict schema)
 *  5. Call OpenAI, parse + deep-validate the JSON response (with retries)
 *  6. Persist to MongoDB, return blueprintId + full document
 */
export const generateBlueprintService = async (
  user: INormalUser,
): Promise<IBlueprintGenerationResult> => {
  const requiredEnv = [
    'OPENAI_API_KEY',
    'PINECONE_API_KEY',
    'PINECONE_INDEX_NAME',
  ] as const;

  for (const key of requiredEnv) {
    if (!process.env[key]) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Missing required environment variable: ${key}`,
      );
    }
  }

  // Clients ─────────────────────────────────────────────────────────────
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  //RAG retrieval ───────────────────────────────────────────────────────
  console.info(
    `[Blueprint] Retrieving RAG context | user: ${user._id} | goal: ${user.fitnessGoal} | level: ${user.experienceLevel} | days: ${user.daysPerWeek}`,
  );

  const ragContext = await retrieveRagContext(user, openai, pinecone);

  //  Generate + validate ────────────────────────────────────────────
  console.info(`[Blueprint] Generating blueprint | user: ${user._id}`);

  const blueprintData = await generateBlueprintFromLLM(
    user,
    ragContext,
    openai,
  );

  // Persist ────────────────────────────────────────────────────────────
  const saved: IBlueprintDocument = await Blueprint.create({
    user: user._id,
    ...blueprintData,
    generatedAt: new Date(),
  });

  console.info(
    `[Blueprint] Saved blueprint ${saved._id} | user: ${user._id}`,
  );

  return {
    blueprintId: saved._id.toString(),
    blueprint: saved,
  };
};


export const getLatestBlueprintService = async (
  userId: string,
): Promise<IBlueprintDocument | null> => {
  return Blueprint.findOne({ userId }).sort({ generatedAt: -1 }).lean().exec();
};


export const getBlueprintHistoryService = async (
  userId: string,
): Promise<IBlueprintDocument[]> => {
  return Blueprint.find({ userId }).sort({ generatedAt: -1 }).lean().exec();
};
