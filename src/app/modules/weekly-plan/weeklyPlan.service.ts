// src/modules/weeklyPlan/weeklyPlan.service.ts

import { Pinecone, type RecordMetadata } from '@pinecone-database/pinecone';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import AppError from '../../error/appError';
import {
  IBlueprintDocument,
  IRagChunkMetadata,
} from '../blueprint/blueprint.interface';
import { Blueprint } from '../blueprint/blueprint.model';
import { INormalUser } from '../normalUser/normalUser.interface';
import { NormalUser } from '../normalUser/normalUser.model';
import {
  IExercise,
  IFood,
  IGenerateWeeklyPlanInput,
  IGenerateWeeklyPlanResult,
  IMeal,
  INutritionPlan,
  IRestDayTemplate,
  ISubmitCheckinInput,
  IWeekDayMeta,
  IWeeklyCheckinDocument,
  IWeeklyPlan,
  IWeeklyPlanDocument,
  IWorkoutDayTemplate,
  IWorkoutPlan,
} from './weeklyPlan.interface';
import { WeeklyCheckin, WeeklyPlan } from './weeklyPlan.model';
import {
  buildEndDate,
  buildWeekDates,
  buildWeeklyPlanPrompt,
} from './weeklyPlan.prompt';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const EMBEDDING_MODEL = 'text-embedding-3-small';
const COMPLETION_MODEL = 'gpt-4o';
const RAG_TOP_K = 6;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

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
]);
const VALID_MEAL_TYPES = new Set(['breakfast', 'lunch', 'dinner', 'snack']);

// Helpers

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const assertEnv = (): void => {
  const required = [
    'OPENAI_API_KEY',
    'PINECONE_API_KEY',
    'PINECONE_INDEX_NAME',
  ] as const;
  for (const key of required) {
    if (!process.env[key]) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Missing env variable: ${key}`,
      );
    }
  }
};

const mapGoalToKiloTags = (fitnessGoal: string): string => {
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

// RAG retrieval

const buildWeeklyRagQuery = (
  user: INormalUser,
  blueprint: IBlueprintDocument,
  weekNumber: number,
): string => {
  const kiloGoal = mapGoalToKiloTags(user.fitnessGoal);
  const thisPhase = blueprint.weeklyPhases.find((p) => p.week === weekNumber);
  const phase = thisPhase?.phase?.toLowerCase() ?? 'accumulation';

  return [
    `${phase} phase rep schemes for ${user.experienceLevel} lifter`,
    `Goal: ${kiloGoal}`,
    `Session structure ${user.daysPerWeek} days per week`,
    `Exercise selection and warm-up protocol`,
    `Progression week ${weekNumber - 1} to week ${weekNumber}`,
    weekNumber === 1 ? 'Standard Sets rep scheme' : `${phase} phase rep scheme`,
  ].join('. ');
};

const retrieveWeeklyRagContext = async (
  user: INormalUser,
  blueprint: IBlueprintDocument,
  weekNumber: number,
  openai: OpenAI,
  pinecone: Pinecone,
): Promise<string> => {
  const indexName = process.env.PINECONE_INDEX_NAME!;

  const embeddingResponse = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: buildWeeklyRagQuery(user, blueprint, weekNumber),
  });

  const queryVector = embeddingResponse.data[0].embedding;

  const filter =
    user.experienceLevel === 'beginner'
      ? { level: { $in: ['beginner', 'all'] } }
      : undefined;

  const index = pinecone.index<IRagChunkMetadata & RecordMetadata>(indexName);

  const { matches = [] } = await index.query({
    vector: queryVector,
    topK: RAG_TOP_K,
    includeMetadata: true,
    ...(filter && { filter }),
  });

  if (!matches.length) return 'No specific knowledge base context found.';

  return matches
    .map((m, i) =>
      m.metadata?.text
        ? `--- Chunk ${i + 1} [${m.metadata.topic ?? 'general'}] ---\n${m.metadata.text}`
        : null,
    )
    .filter(Boolean)
    .join('\n\n');
};

// Validation

const assertPositiveInt = (val: unknown, path: string): void => {
  if (typeof val !== 'number' || !Number.isInteger(val) || val <= 0) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Weekly plan validation: ${path} must be a positive integer, got ${val}`,
    );
  }
};

const assertNonNegativeInt = (val: unknown, path: string): void => {
  if (typeof val !== 'number' || !Number.isInteger(val) || val < 0) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Weekly plan validation: ${path} must be a non-negative integer, got ${val}`,
    );
  }
};

const assertPositiveNum = (val: unknown, path: string): void => {
  if (typeof val !== 'number' || val <= 0) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Weekly plan validation: ${path} must be a positive number, got ${val}`,
    );
  }
};

const validateNutritionPlan = (
  np: INutritionPlan,
  prefix: string,
  expectedMeals: number,
): void => {
  if (!np)
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${prefix} is missing`,
    );

  assertPositiveInt(np.targetCalories, `${prefix}.targetCalories`);
  assertPositiveInt(np.targetProtein, `${prefix}.targetProtein`);
  assertPositiveInt(np.targetCarbs, `${prefix}.targetCarbs`);
  assertPositiveInt(np.targetFat, `${prefix}.targetFat`);

  if (!Array.isArray(np.meals) || np.meals.length !== expectedMeals) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${prefix}.meals must have exactly ${expectedMeals} item(s), got ${Array.isArray(np.meals) ? np.meals.length : typeof np.meals}`,
    );
  }

  np.meals.forEach((meal: IMeal, i: number) => {
    const mp = `${prefix}.meals[${i}]`;
    if (!VALID_MEAL_TYPES.has(meal.mealType)) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `${mp}.mealType must be one of [${[...VALID_MEAL_TYPES].join(', ')}], got "${meal.mealType}"`,
      );
    }
    assertPositiveInt(meal.targetCalories, `${mp}.targetCalories`);
    assertNonNegativeInt(meal.targetProtein, `${mp}.targetProtein`);
    assertNonNegativeInt(meal.targetCarbs, `${mp}.targetCarbs`);
    assertNonNegativeInt(meal.targetFat, `${mp}.targetFat`);

    if (!Array.isArray(meal.foods) || meal.foods.length < 2) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `${mp}.foods must have at least 2 items`,
      );
    }

    meal.foods.forEach((food: IFood, fi: number) => {
      const fp = `${mp}.foods[${fi}]`;
      if (!food.name || !food.quantity) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `${fp} must have name and quantity`,
        );
      }
      assertPositiveInt(food.calories, `${fp}.calories`);
      assertNonNegativeInt(food.protein, `${fp}.protein`);
      assertNonNegativeInt(food.carbs, `${fp}.carbs`);
      assertNonNegativeInt(food.fat, `${fp}.fat`);
      if (!Array.isArray(food.alternatives)) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `${fp}.alternatives must be an array`,
        );
      }
    });
  });
};

const validateWorkoutPlan = (wp: IWorkoutPlan, prefix: string): void => {
  if (!VALID_WORKOUT_TYPES.has(wp.workoutType)) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${prefix}.workoutType must be one of [${[...VALID_WORKOUT_TYPES].join(', ')}], got "${wp.workoutType}"`,
    );
  }
  if (!wp.focus || typeof wp.focus !== 'string') {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${prefix}.focus is required`,
    );
  }
  assertPositiveNum(
    wp.estimatedDurationMinutes,
    `${prefix}.estimatedDurationMinutes`,
  );

  const blocks = [
    { key: 'exercises', arr: wp.exercises, min: 3 },
    { key: 'warmup', arr: wp.warmup, min: 1 },
    { key: 'cooldown', arr: wp.cooldown, min: 1 },
  ] as const;

  for (const block of blocks) {
    if (!Array.isArray(block.arr) || block.arr.length < block.min) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `${prefix}.${block.key} must be an array with at least ${block.min} item(s)`,
      );
    }
    block.arr.forEach((ex: IExercise, i: number) => {
      const ep = `${prefix}.${block.key}[${i}]`;
      if (!ex.name)
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `${ep}.name is required`,
        );
      if (!ex.reps)
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `${ep}.reps is required`,
        );
      assertPositiveInt(ex.sets, `${ep}.sets`);
      if (typeof ex.restSeconds !== 'number' || ex.restSeconds < 0) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `${ep}.restSeconds must be >= 0`,
        );
      }
      if (!Array.isArray(ex.alternatives)) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `${ep}.alternatives must be an array`,
        );
      }
    });
  }
};

const validateWorkoutDayTemplate = (
  tpl: IWorkoutDayTemplate,
  mealsPerDay: number,
): void => {
  if (!tpl) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'workoutDayTemplate is missing',
    );
  }
  validateNutritionPlan(
    tpl.nutritionPlan,
    'workoutDayTemplate.nutritionPlan',
    mealsPerDay,
  );
  if (!tpl.workoutPlan) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'workoutDayTemplate.workoutPlan is missing',
    );
  }
  validateWorkoutPlan(tpl.workoutPlan, 'workoutDayTemplate.workoutPlan');
};

const validateRestDayTemplate = (
  tpl: IRestDayTemplate,
  mealsPerDay: number,
): void => {
  if (!tpl) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'restDayTemplate is missing',
    );
  }
  validateNutritionPlan(
    tpl.nutritionPlan,
    'restDayTemplate.nutritionPlan',
    mealsPerDay,
  );

  // restDayTemplate must NOT have a workoutPlan key
  if ((tpl as unknown as Record<string, unknown>).workoutPlan !== undefined) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'restDayTemplate must not contain a workoutPlan',
    );
  }
};

const validateRestDayCaloriesLower = (
  workoutTemplate: IWorkoutDayTemplate,
  restTemplate: IRestDayTemplate,
): void => {
  const workoutCals = workoutTemplate.nutritionPlan.targetCalories;
  const restCals = restTemplate.nutritionPlan.targetCalories;

  if (restCals >= workoutCals) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `restDayTemplate calories (${restCals}) must be lower than workoutDayTemplate calories (${workoutCals})`,
    );
  }
};

/**
 * Full deep validation of the two-template shape returned by the LLM.
 */
const validateWeeklyPlanShape = (
  raw: unknown,
  user: INormalUser,
  weekNumber: number,
): void => {
  const w = raw as Partial<IWeeklyPlan>;

  // ── Top-level fields ───────────────────────────────────────────────────────
  if (w.weekNumber !== weekNumber) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `weekNumber must be ${weekNumber}, got ${w.weekNumber}`,
    );
  }
  if (!VALID_PHASES.has(w.phase ?? '')) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `phase must be one of [${[...VALID_PHASES].join(', ')}], got "${w.phase}"`,
    );
  }
  if (typeof w.objective !== 'string' || !w.objective.trim()) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'objective must be a non-empty string',
    );
  }

  // ── Templates ──────────────────────────────────────────────────────────────
  validateWorkoutDayTemplate(
    w.workoutDayTemplate as IWorkoutDayTemplate,
    user.mealsPerDay,
  );
  validateRestDayTemplate(
    w.restDayTemplate as IRestDayTemplate,
    user.mealsPerDay,
  );
  validateRestDayCaloriesLower(
    w.workoutDayTemplate as IWorkoutDayTemplate,
    w.restDayTemplate as IRestDayTemplate,
  );
};

// Schedule builder
// Constructs the 7-day metadata schedule from the blueprint — no AI needed.

const buildSchedule = (
  blueprint: IBlueprintDocument,
  startDate: string,
): IWeekDayMeta[] => {
  const dates = buildWeekDates(startDate);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return blueprint.weeklySchedule.map((entry, i) => ({
    day: i + 1,
    date: dates[i],
    isWorkoutDay: entry.isWorkoutDay,
    workoutType: entry.isWorkoutDay ? entry.workoutType : 'Rest',
    focus: entry.isWorkoutDay ? entry.focus : `Rest — ${dayNames[i]}`,
  }));
};

// LLM generation

const generateTemplatesFromLLM = async (
  input: IGenerateWeeklyPlanInput,
  ragContext: string,
  openai: OpenAI,
): Promise<
  Pick<
    IWeeklyPlan,
    | 'weekNumber'
    | 'phase'
    | 'objective'
    | 'workoutDayTemplate'
    | 'restDayTemplate'
  >
> => {
  const { user, blueprint, weekNumber, startDate, previousPlan, checkin } =
    input;

  const prompt = buildWeeklyPlanPrompt(
    user,
    blueprint,
    weekNumber,
    startDate,
    ragContext,
    previousPlan,
    checkin,
  );

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: COMPLETION_MODEL,
        temperature: 0.3,
        max_tokens: 6000, // two templates instead of 7 days — fits comfortably
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are an elite strength coach and sports nutritionist. Respond with valid JSON only. No markdown. No explanation.',
          },
          { role: 'user', content: prompt },
        ],
      });

      const rawContent = response.choices[0]?.message?.content;
      if (!rawContent) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'OpenAI returned empty response',
        );
      }

      const cleaned = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const parsed: unknown = JSON.parse(cleaned);

      validateWeeklyPlanShape(parsed, user, weekNumber);

      return parsed as Pick<
        IWeeklyPlan,
        | 'weekNumber'
        | 'phase'
        | 'objective'
        | 'workoutDayTemplate'
        | 'restDayTemplate'
      >;
    } catch (error) {
      lastError = error as Error;

      const isRetryable =
        error instanceof SyntaxError ||
        error instanceof AppError ||
        (error as { status?: number }).status === 429 ||
        (error as { status?: number }).status === 500;

      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt;
        console.warn(
          `[WeeklyPlan] Attempt ${attempt}/${MAX_RETRIES} failed — retrying in ${delay}ms. Reason: ${lastError.message}`,
        );
        await sleep(delay);
        continue;
      }
      break;
    }
  }

  throw new AppError(
    httpStatus.INTERNAL_SERVER_ERROR,
    `Weekly plan generation failed after ${MAX_RETRIES} attempts: ${lastError?.message ?? 'Unknown error'}`,
  );
};

// Internal orchestrator

const _generateAndSave = async (
  input: IGenerateWeeklyPlanInput,
  openai: OpenAI,
  pinecone: Pinecone,
): Promise<IGenerateWeeklyPlanResult> => {
  const { user, blueprint, weekNumber, startDate } = input;

  // Prevent duplicate plans
  const existing = await WeeklyPlan.findOne({
    blueprintId: blueprint._id,
    weekNumber,
  });
  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Week ${weekNumber} plan already exists for this blueprint. Delete it first to regenerate.`,
    );
  }

  console.info(
    `[WeeklyPlan] RAG retrieval | user: ${user._id} | week: ${weekNumber}`,
  );
  const ragContext = await retrieveWeeklyRagContext(
    user,
    blueprint,
    weekNumber,
    openai,
    pinecone,
  );

  console.info(
    `[WeeklyPlan] Generating templates | user: ${user._id} | week: ${weekNumber}`,
  );
  const templates = await generateTemplatesFromLLM(input, ragContext, openai);

  // Schedule is built deterministically from the blueprint — no AI needed
  const schedule = buildSchedule(blueprint, startDate);

  const saved: IWeeklyPlanDocument = await WeeklyPlan.create({
    userId: user._id,
    blueprintId: blueprint._id,
    weekNumber,
    phase: templates.phase,
    objective: templates.objective,
    startDate,
    endDate: buildEndDate(startDate),
    schedule,
    workoutDayTemplate: templates.workoutDayTemplate,
    restDayTemplate: templates.restDayTemplate,
    generatedAt: new Date(),
  });

  console.info(
    `[WeeklyPlan] Saved plan ${saved._id} | user: ${user._id} | week: ${weekNumber}`,
  );

  return { weeklyPlanId: saved._id.toString(), weeklyPlan: saved };
};

// ─────────────────────────────────────────────────────────────────────────────
// Public services
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate Week 1.
 * No previous plan or check-in — starts fresh from blueprint defaults.
 */
export const generateWeek1Service = async (
  userId: string,
  startDate: string,
): Promise<IGenerateWeeklyPlanResult> => {
  assertEnv();

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

  const blueprint = (await Blueprint.findOne({
    user: userId,
  }).lean()) as IBlueprintDocument | null;
  console.log("Blueprint", blueprint)
  if (!blueprint)
    throw new AppError(httpStatus.NOT_FOUND, 'Blueprint not found');

  console.log("userId", userId)
  const data = await NormalUser.findOne();
  console.log(data)
  const userData = (await NormalUser.findById(userId).lean()) as INormalUser | null;
  console.log("User Data", userData)
  if (!userData) throw new AppError(httpStatus.NOT_FOUND, 'User profile not found');

  return _generateAndSave(
    {
      user: userData,
      blueprint,
      weekNumber: 1,
      startDate,
      previousPlan: null,
      checkin: null,
    },
    openai,
    pinecone,
  );
};

/**
 * Generate Week 2, 3, or 4.
 * Fetches the previous week's plan and check-in automatically.
 * Weeks MUST be generated in order — Week 3 requires Week 2 to exist first.
 */
export const generateNextWeekService = async (
  userId: string,
  blueprintId: string,
  weekNumber: number,
  startDate: string,
): Promise<IGenerateWeeklyPlanResult> => {
  assertEnv();

  if (weekNumber < 2 || weekNumber > 4) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'weekNumber must be 2, 3, or 4. Use generateWeek1 for the first week.',
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

  const blueprint = (await Blueprint.findById(
    blueprintId,
  ).lean()) as IBlueprintDocument | null;
  if (!blueprint)
    throw new AppError(httpStatus.NOT_FOUND, 'Blueprint not found');

  const { NormalUser } = await import('../normalUser/normalUser.model');
  const user = (await NormalUser.findOne({
    user: blueprint.user,
  }).lean()) as INormalUser | null;
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User profile not found');

  const prevWeek = weekNumber - 1;

  const previousPlan = (await WeeklyPlan.findOne({
    blueprintId,
    weekNumber: prevWeek,
  }).lean()) as IWeeklyPlanDocument | null;

  if (!previousPlan) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot generate Week ${weekNumber} — Week ${prevWeek} plan not found. Generate weeks in order.`,
    );
  }

  const checkin = (await WeeklyCheckin.findOne({
    blueprintId,
    weekNumber: prevWeek,
  }).lean()) as IWeeklyCheckinDocument | null;

  if (!checkin) {
    console.warn(
      `[WeeklyPlan] No check-in for Week ${prevWeek} — proceeding with blueprint defaults`,
    );
  }

  return _generateAndSave(
    { user, blueprint, weekNumber, startDate, previousPlan, checkin },
    openai,
    pinecone,
  );
};

// Check-in service

/**
 * Submit an end-of-week check-in.
 * This data feeds directly into the next week's generation prompt.
 */
export const submitCheckinService = async (
  input: ISubmitCheckinInput,
): Promise<IWeeklyCheckinDocument> => {
  const {
    userId,
    blueprintId,
    weeklyPlanId,
    weekNumber,
    currentWeight,
    workoutCompletionRate,
    mealCompletionRate,
    energyLevel,
    recoveryLevel,
    notes,
  } = input;

  const plan = await WeeklyPlan.findOne({
    _id: weeklyPlanId,
    userId: new mongoose.Types.ObjectId(userId),
    blueprintId: new mongoose.Types.ObjectId(blueprintId),
  });

  if (!plan) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Weekly plan not found or does not belong to this user',
    );
  }

  const existing = await WeeklyCheckin.findOne({
    blueprintId: new mongoose.Types.ObjectId(blueprintId),
    weekNumber,
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      `A check-in for Week ${weekNumber} already exists. Update it instead of creating a new one.`,
    );
  }

  const checkin = await WeeklyCheckin.create({
    userId: new mongoose.Types.ObjectId(userId),
    blueprintId: new mongoose.Types.ObjectId(blueprintId),
    weeklyPlanId: new mongoose.Types.ObjectId(weeklyPlanId),
    weekNumber,
    currentWeight,
    workoutCompletionRate,
    mealCompletionRate,
    energyLevel,
    recoveryLevel,
    notes,
    submittedAt: new Date(),
  });

  console.info(
    `[WeeklyPlan] Check-in saved | user: ${userId} | week: ${weekNumber}`,
  );
  return checkin;
};

// ─────────────────────────────────────────────────────────────────────────────
// Query services
// ─────────────────────────────────────────────────────────────────────────────

export const getWeeklyPlanService = async (
  blueprintId: string,
  weekNumber: number,
): Promise<IWeeklyPlanDocument | null> =>
  WeeklyPlan.findOne({ blueprintId, weekNumber }).lean().exec();

export const getAllWeeklyPlansService = async (
  blueprintId: string,
): Promise<IWeeklyPlanDocument[]> =>
  WeeklyPlan.find({ blueprintId }).sort({ weekNumber: 1 }).lean().exec();

export const getCheckinService = async (
  blueprintId: string,
  weekNumber: number,
): Promise<IWeeklyCheckinDocument | null> =>
  WeeklyCheckin.findOne({ blueprintId, weekNumber }).lean().exec();

export const getAllCheckinsService = async (
  blueprintId: string,
): Promise<IWeeklyCheckinDocument[]> =>
  WeeklyCheckin.find({ blueprintId }).sort({ weekNumber: 1 }).lean().exec();

export const getTodayActivityService = async (
  profileId: string,
  targetDate: string,
): Promise<any | null> => {

  const start = new Date(targetDate);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(targetDate);
  end.setUTCHours(23, 59, 59, 999);

  const plan = await WeeklyPlan.findOne({
    userId: new mongoose.Types.ObjectId(profileId),
    startDate: { $lte: end },
    endDate: { $gte: start },
  });

  console.log("Plan", plan)

  if (!plan) {
    return null;
  }

  const dayMeta = plan.schedule.find((d) => d.date === targetDate);
  if (!dayMeta) {
    return null;
  }

  const response: any = {
    date: targetDate,
    dayOfWeek: dayMeta.day,
    isWorkoutDay: dayMeta.isWorkoutDay,
    workoutType: dayMeta.workoutType,
    focus: dayMeta.focus,
    weekNumber: plan.weekNumber,
    phase: plan.phase,
    objective: plan.objective,
    blueprintId: plan.blueprintId.toString(),
    weeklyPlanId: plan._id.toString(),
  };

  if (dayMeta.isWorkoutDay) {
    response.nutritionPlan = plan.workoutDayTemplate.nutritionPlan;
    response.workoutPlan = plan.workoutDayTemplate.workoutPlan;
  } else {
    response.nutritionPlan = plan.restDayTemplate.nutritionPlan;
  }

  return response;
};
