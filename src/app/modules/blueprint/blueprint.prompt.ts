// src/modules/blueprint/blueprint.prompt.ts

import { INormalUser } from '../normalUser/normalUser.interface';

// ── Strict JSON Schema (sent verbatim to the LLM) ────────────────────────────
//
// Rules baked in:
//  - Every field has an explicit type annotation and description
//  - Enum constraints are listed inline so the model never invents values
//  - Array length constraints are stated explicitly
//  - Numeric ranges are declared (min/max)
//  - Required fields are marked with [REQUIRED]
//  - The model is told to use null for optional unknowns, never omit keys
//
const STRICT_BLUEPRINT_SCHEMA = `
RETURN EXACTLY THIS JSON STRUCTURE — NO EXTRA KEYS, NO MISSING KEYS, NO MARKDOWN:

{
  "goal": "[REQUIRED] string — one of: muscle_gain | strength | fat_loss | endurance | general_fitness | athletic_performance | weight_loss",

  "durationDays": "[REQUIRED] number — always exactly 30",

  "weeklyPhases": "[REQUIRED] array — MUST contain EXACTLY 4 objects, one per week",
  [
    {
      "week": "[REQUIRED] number — 1, 2, 3, or 4",
      "phase": "[REQUIRED] string — one of: Accumulation | Intensification | Deload | Peak",
      "objective": "[REQUIRED] string — 1-2 sentence description of the week's training focus",
      "intensity": "[REQUIRED] number — integer between 1 and 10 (1=very easy, 10=maximal effort)"
    }
  ],

  "nutritionStrategy": {
    "targetCalories": "[REQUIRED] number — total daily calories as a positive integer",
    "targetProtein":  "[REQUIRED] number — daily protein in grams as a positive integer",
    "targetCarbs":    "[REQUIRED] number — daily carbohydrates in grams as a positive integer",
    "targetFat":      "[REQUIRED] number — daily fat in grams as a positive integer",
    "hydrationTargetLiters": "[REQUIRED] number — daily water intake in liters, e.g. 3.5"
  },

  "progressionStrategy": {
    "type":        "[REQUIRED] string — one of: Linear | Wave | Step | Undulating | Block",
    "description": "[REQUIRED] string — 2-3 sentences explaining how load/volume progresses week to week"
  },

  "recoveryStrategy": {
    "sleepTargetHours": "[REQUIRED] number — recommended nightly sleep hours, between 7 and 9",
    "restDaysPerWeek":  "[REQUIRED] number — number of full rest days per week, between 1 and 5"
  },

  "weeklySchedule": "[REQUIRED] array — MUST contain EXACTLY 7 objects, one per day (Mon=1 through Sun=7)",
  [
    {
      "dayOfWeek":    "[REQUIRED] number — 1 (Monday) through 7 (Sunday)",
      "workoutType":  "[REQUIRED] string — one of: Upper Body | Lower Body | Full Body | Conditioning | Active Recovery | Rest",
      "focus":        "[REQUIRED] string — specific primary exercise(s) for the day, e.g. 'Overhead Press + Chin-Up' or 'Rest Day' if isWorkoutDay is false",
      "isWorkoutDay": "[REQUIRED] boolean — true if this is a training day, false if rest"
    }
  ]
}
`.trim();

// ── Injury context builder ────────────────────────────────────────────────────
//
// Converts the user's injuries array into a clear constraint block.
// The LLM must see injuries as hard limits, not soft preferences.
//
const buildInjuryContext = (user: INormalUser): string => {
  if (!user.injuries?.length) {
    return 'Injuries: None reported.';
  }

  const injuryList = user.injuries.map((injury) => `  - ${injury}`).join('\n');
  const note = user.additionalNoteForInjuries
    ? `\n  Additional context: ${user.additionalNoteForInjuries}`
    : '';

  return `Injuries (MUST avoid exercises that aggravate these):\n${injuryList}${note}`;
};

// ── Equipment context builder ─────────────────────────────────────────────────
//
// Makes equipment a hard constraint, not a preference.
// The LLM must only prescribe exercises achievable with the listed equipment.
//
const buildEquipmentContext = (user: INormalUser): string => {
  if (!user.availableEquipment?.length) {
    return 'Equipment: Standard commercial gym (all equipment available).';
  }

  return `Available Equipment (ONLY prescribe exercises using this equipment):\n${user.availableEquipment.map((e) => `  - ${e}`).join('\n')}`;
};

// ── Nutrition calculation hints ───────────────────────────────────────────────
//
// Gives the LLM anchors for macro calculation rather than letting it guess.
// These are ranges, not exact values — the LLM adjusts for the user's goal.
//
const buildNutritionHints = (user: INormalUser): string => {
  const weightKg = user.weight;
  const goal = user.fitnessGoal;

  // Protein anchors
  const proteinMultiplierLow = 1.6;
  const proteinMultiplierHigh = 2.2;
  const proteinMin = Math.round(weightKg * proteinMultiplierLow);
  const proteinMax = Math.round(weightKg * proteinMultiplierHigh);

  // Calorie anchors based on goal
  const calorieNotes: Record<string, string> = {
    muscle_gain: `caloric surplus of +200 to +400 kcal above TDEE`,
    strength: `caloric surplus of +100 to +300 kcal above TDEE`,
    fat_loss: `caloric deficit of -300 to -500 kcal below TDEE`,
    weight_loss: `caloric deficit of -400 to -600 kcal below TDEE`,
    endurance: `maintenance calories or slight surplus`,
    general_fitness: `maintenance calories`,
    athletic_performance: `caloric surplus of +200 to +500 kcal above TDEE`,
  };

  const calorieNote = calorieNotes[goal] ?? 'maintenance calories';

  return `Nutrition Calculation Hints:
  - Body weight: ${weightKg} kg
  - Protein target: ${proteinMin}–${proteinMax} g/day (${proteinMultiplierLow}–${proteinMultiplierHigh} g per kg bodyweight)
  - Calorie strategy: ${calorieNote}
  - Dietary preferences to respect: ${user.dietaryPreferences?.join(', ') || 'None'}
  - Meals per day: ${user.mealsPerDay}`;
};

// ── Schedule constraint builder ───────────────────────────────────────────────
//
// Tells the LLM exactly how many workout days to schedule and which KILO
// microcycle template to use based on daysPerWeek.
//
const buildScheduleConstraints = (user: INormalUser): string => {
  const scheduleMap: Record<number, string> = {
    2: `2 workout days (Full Body sessions). Use KILO 2x/week microcycle: Full Body 1 and Full Body 2 with 3 days between sessions.`,
    3: `3 workout days. Use KILO 3x/week microcycle: alternate Upper/Lower/Upper or Lower/Upper/Lower each week.`,
    4: `4 workout days (Mon Upper, Tue Lower, Thu Upper, Fri Lower). Use KILO 4x/week microcycle alternating Microcycle 1 and Microcycle 2 each week.`,
    5: `5 workout days. Use KILO 4x/week as base and add one additional conditioning or accessory session.`,
  };

  const scheduleNote =
    scheduleMap[user.daysPerWeek] ??
    `${user.daysPerWeek} workout days per week.`;

  return `Schedule Constraints:
  - Training days per week: ${user.daysPerWeek}
  - ${scheduleNote}
  - Preferred workout time: ${user.preferredWorkoutTime}
  - Wake-up time: ${user.wakeUpTime} | Bedtime: ${user.bedTime}
  - Include warm-up in sessions: ${user.includeWarmup ? 'Yes — include KILO warm-up protocol' : 'No'}`;
};

// ── Main prompt builder ───────────────────────────────────────────────────────

export const buildBlueprintPrompt = (
  user: INormalUser,
  ragContext: string,
): string => {
  return `
You are an elite strength coach and sports nutritionist certified in KILO Strength Society methodology.

Your task is to generate a science-based 30-day fitness blueprint for the user below.
You MUST follow the KILO methodology principles provided in the knowledge base.
You MUST return ONLY a single valid JSON object matching the exact schema below.
Do NOT include any explanation, markdown, code fences, or text outside the JSON.

════════════════════════════════════════
USER PROFILE
════════════════════════════════════════
Name:               ${user.name}
Age:                ${user.age} years
Gender:             ${user.gender ?? 'Not specified'}
Height:             ${user.height} cm
Weight:             ${user.weight} kg
Fitness Goal:       ${user.fitnessGoal}
Experience Level:   ${user.experienceLevel}
Activity Level:     ${user.activityLevel}

${buildInjuryContext(user)}

${buildEquipmentContext(user)}

${buildNutritionHints(user)}

${buildScheduleConstraints(user)}

════════════════════════════════════════
KILO METHODOLOGY KNOWLEDGE BASE
(Use this to inform rep schemes, session structure, microcycle design, and progression)
════════════════════════════════════════
${ragContext}

════════════════════════════════════════
GENERATION RULES
════════════════════════════════════════
1. weeklyPhases — MUST be exactly 4 items (one per week). week values must be 1, 2, 3, 4.
2. weeklySchedule — MUST be exactly 7 items (one per day). dayOfWeek values must be 1–7.
3. Workout days in weeklySchedule must match daysPerWeek: ${user.daysPerWeek} days.
4. Rest days must have isWorkoutDay: false and workoutType: "Rest".
5. nutritionStrategy values must be positive integers (except hydrationTargetLiters which is a decimal).
6. Do NOT prescribe exercises requiring equipment not listed in the user's available equipment.
7. Do NOT prescribe exercises that could aggravate the user's listed injuries.
8. Beginner users MUST use Standard Sets rep scheme in week 1 and 2.
9. Front Squat and Deadlift A-series sets MUST never exceed 6 reps.
10. intensity in weeklyPhases must follow a logical progression (e.g. 6 → 7 → 8 → 5 for a deload).

════════════════════════════════════════
EXACT JSON SCHEMA TO RETURN
════════════════════════════════════════
${STRICT_BLUEPRINT_SCHEMA}
`.trim();
};
