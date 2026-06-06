// src/modules/weeklyPlan/weeklyPlan.prompt.ts

import { IBlueprintDocument } from '../blueprint/blueprint.interface';
import { INormalUser } from '../normalUser/normalUser.interface';
import {
  IWeeklyCheckinDocument,
  IWeeklyPlanDocument,
} from './weeklyPlan.interface';

// ─────────────────────────────────────────────────────────────────────────────
// Strict JSON schema
// The LLM generates exactly TWO templates, not 7 days.
// ─────────────────────────────────────────────────────────────────────────────

const STRICT_WEEKLY_PLAN_SCHEMA = `
RETURN EXACTLY THIS JSON STRUCTURE — NO EXTRA KEYS, NO MISSING KEYS, NO MARKDOWN:

{
  "weekNumber": "[REQUIRED] number — 1, 2, 3, or 4",
  "phase":      "[REQUIRED] string — one of: Accumulation | Intensification | Deload | Peak",
  "objective":  "[REQUIRED] string — 1-2 sentence summary of this week's focus",

  "workoutDayTemplate": {
    "nutritionPlan": {
      "targetCalories": "[REQUIRED] number — positive integer (training day — higher carbs)",
      "targetProtein":  "[REQUIRED] number — grams, positive integer",
      "targetCarbs":    "[REQUIRED] number — grams, positive integer (higher than rest day)",
      "targetFat":      "[REQUIRED] number — grams, positive integer",
      "meals": "[REQUIRED] array — MUST have exactly {MEALS_PER_DAY} meal(s)",
      [
        {
          "mealType":      "[REQUIRED] string — one of: breakfast | lunch | dinner | snack",
          "targetCalories":"[REQUIRED] number — positive integer",
          "targetProtein": "[REQUIRED] number — grams, positive integer",
          "targetCarbs":   "[REQUIRED] number — grams, positive integer",
          "targetFat":     "[REQUIRED] number — grams, positive integer",
          "foods": "[REQUIRED] array — 2 to 5 food items",
          [
            {
              "name":         "[REQUIRED] string — specific food e.g. 'Grilled Chicken Breast'",
              "quantity":     "[REQUIRED] string — e.g. '150g' or '2 whole eggs'",
              "calories":     "[REQUIRED] number — positive integer",
              "protein":      "[REQUIRED] number — grams, positive integer",
              "carbs":        "[REQUIRED] number — grams, positive integer",
              "fat":          "[REQUIRED] number — grams, positive integer",
              "alternatives": "[REQUIRED] array — 1 to 2 swap options with equivalent macros",
              [
                {
                  "name":     "[REQUIRED] string",
                  "quantity": "[REQUIRED] string",
                  "calories": "[REQUIRED] number",
                  "protein":  "[REQUIRED] number",
                  "carbs":    "[REQUIRED] number",
                  "fat":      "[REQUIRED] number"
                }
              ]
            }
          ]
        }
      ]
    },
    "workoutPlan": {
      "workoutType":              "[REQUIRED] string — one of: Upper Body | Lower Body | Full Body | Conditioning | Active Recovery",
      "focus":                    "[REQUIRED] string — primary exercise(s) e.g. 'Overhead Press + Chin-Up'",
      "estimatedDurationMinutes": "[REQUIRED] number — integer between 45 and 90",
      "warmup": "[REQUIRED] array — 2 to 4 warm-up exercises following KILO warm-up protocol",
      [
        {
          "name":          "[REQUIRED] string",
          "sets":          "[REQUIRED] number — positive integer",
          "reps":          "[REQUIRED] string — e.g. '10', '8-10', '30 seconds'",
          "restSeconds":   "[REQUIRED] number — 0 to 300",
          "targetMuscles": "[REQUIRED] array of strings",
          "instructions":  "[REQUIRED] array — 2 to 4 instruction strings",
          "alternatives":  "[REQUIRED] array — 1 to 2 items: [{ 'name': 'string' }]"
        }
      ],
      "exercises": "[REQUIRED] array — 4 to 8 main working exercises (A, B, C series per KILO)",
      [
        {
          "name":          "[REQUIRED] string",
          "sets":          "[REQUIRED] number",
          "reps":          "[REQUIRED] string",
          "restSeconds":   "[REQUIRED] number",
          "targetMuscles": "[REQUIRED] array of strings",
          "instructions":  "[REQUIRED] array of strings",
          "alternatives":  "[REQUIRED] array of { name: string }"
        }
      ],
      "cooldown": "[REQUIRED] array — 2 to 3 cool-down or mobility exercises",
      [
        {
          "name":          "[REQUIRED] string",
          "sets":          "[REQUIRED] number",
          "reps":          "[REQUIRED] string",
          "restSeconds":   "[REQUIRED] number",
          "targetMuscles": "[REQUIRED] array of strings",
          "instructions":  "[REQUIRED] array of strings",
          "alternatives":  "[REQUIRED] array of { name: string }"
        }
      ]
    }
  },

  "restDayTemplate": {
    "nutritionPlan": {
      "targetCalories": "[REQUIRED] number — positive integer (rest day — lower carbs than workout day, same protein)",
      "targetProtein":  "[REQUIRED] number — grams, positive integer (same as workout day)",
      "targetCarbs":    "[REQUIRED] number — grams, positive integer (10-20% lower than workout day)",
      "targetFat":      "[REQUIRED] number — grams, positive integer",
      "meals": "[REQUIRED] array — MUST have exactly {MEALS_PER_DAY} meal(s)",
      [
        {
          "mealType":      "[REQUIRED] string — one of: breakfast | lunch | dinner | snack",
          "targetCalories":"[REQUIRED] number",
          "targetProtein": "[REQUIRED] number",
          "targetCarbs":   "[REQUIRED] number",
          "targetFat":     "[REQUIRED] number",
          "foods": "[REQUIRED] array — 2 to 5 food items",
          [
            {
              "name":         "[REQUIRED] string",
              "quantity":     "[REQUIRED] string",
              "calories":     "[REQUIRED] number",
              "protein":      "[REQUIRED] number",
              "carbs":        "[REQUIRED] number",
              "fat":          "[REQUIRED] number",
              "alternatives": "[REQUIRED] array — 1 to 2 swap options",
              [
                {
                  "name":     "[REQUIRED] string",
                  "quantity": "[REQUIRED] string",
                  "calories": "[REQUIRED] number",
                  "protein":  "[REQUIRED] number",
                  "carbs":    "[REQUIRED] number",
                  "fat":      "[REQUIRED] number"
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export const buildWeekDates = (startDate: string): string[] => {
  const dates: string[] = [];
  const base = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export const buildEndDate = (startDate: string): string => {
  const base = new Date(startDate);
  base.setDate(base.getDate() + 6);
  return base.toISOString().split('T')[0];
};

// ─────────────────────────────────────────────────────────────────────────────
// Context builders
// ─────────────────────────────────────────────────────────────────────────────

const buildBlueprintContext = (
  blueprint: IBlueprintDocument,
  weekNumber: number,
): string => {
  const thisPhase = blueprint.weeklyPhases.find((p) => p.week === weekNumber);
  const workoutDays = blueprint.weeklySchedule.filter((d) => d.isWorkoutDay);
  const restDays = blueprint.weeklySchedule.filter((d) => !d.isWorkoutDay);

  const workoutDayLines = workoutDays
    .map((d) => {
      const name = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][
        d.dayOfWeek - 1
      ];
      return `  Day ${d.dayOfWeek} (${name}): ${d.workoutType} — ${d.focus}`;
    })
    .join('\n');

  const restDayNames = restDays
    .map(
      (d) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d.dayOfWeek - 1],
    )
    .join(', ');

  return `
════════════════════════════════════════
30-DAY BLUEPRINT CONTEXT
════════════════════════════════════════
Overall goal:       ${blueprint.goal}
Progression type:   ${blueprint.progressionStrategy.type}
Progression detail: ${blueprint.progressionStrategy.description}
Sleep target:       ${blueprint.recoveryStrategy.sleepTargetHours} hrs/night
Rest days/week:     ${blueprint.recoveryStrategy.restDaysPerWeek}

Blueprint daily nutrition targets:
  Calories:  ${blueprint.nutritionStrategy.targetCalories} kcal (training day)
  Protein:   ${blueprint.nutritionStrategy.targetProtein} g
  Carbs:     ${blueprint.nutritionStrategy.targetCarbs} g
  Fat:       ${blueprint.nutritionStrategy.targetFat} g
  Hydration: ${blueprint.nutritionStrategy.hydrationTargetLiters} L

THIS WEEK — Week ${weekNumber}:
  Phase:     ${thisPhase?.phase ?? 'Accumulation'}
  Objective: ${thisPhase?.objective ?? 'Build foundational work capacity'}
  Intensity: ${thisPhase?.intensity ?? 6}/10

Workout days this week (${workoutDays.length} days):
${workoutDayLines}

Rest days this week: ${restDayNames}

WORKOUT DAY TEMPLATE instruction:
  The workoutPlan.workoutType and workoutPlan.focus in workoutDayTemplate
  MUST match the FIRST workout day listed above (Day ${workoutDays[0]?.dayOfWeek}).
  All workout days this week follow the same template.
`.trim();
};

const buildPreviousWeekContext = (
  previousPlan: IWeeklyPlanDocument | null | undefined,
): string => {
  if (!previousPlan) {
    return `
════════════════════════════════════════
PREVIOUS WEEK
════════════════════════════════════════
This is Week 1 — no previous data. Start at conservative baseline loads.
`.trim();
  }

  const wp = previousPlan.workoutDayTemplate.workoutPlan;
  const exerciseSummary = wp.exercises
    .map(
      (e) => `    • ${e.name}: ${e.sets} x ${e.reps} (rest ${e.restSeconds}s)`,
    )
    .join('\n');

  return `
════════════════════════════════════════
PREVIOUS WEEK (Week ${previousPlan.weekNumber}) SUMMARY
════════════════════════════════════════
Phase completed:  ${previousPlan.phase}
Objective was:    ${previousPlan.objective}
Workout focus:    ${wp.workoutType} — ${wp.focus}

Exercises performed last week:
${exerciseSummary}

Training day nutrition: ${previousPlan.workoutDayTemplate.nutritionPlan.targetCalories} kcal
Rest day nutrition:     ${previousPlan.restDayTemplate.nutritionPlan.targetCalories} kcal

PROGRESSION INSTRUCTION:
  - Increase load or volume by 2-5% on the same exercises where possible
  - If a new phase starts this week, introduce the next rep scheme in the KILO order
  - Do NOT repeat identical sets/reps from last week unless this is a deload week
`.trim();
};

const buildCheckinContext = (
  checkin: IWeeklyCheckinDocument | null | undefined,
  weekNumber: number,
): string => {
  if (!checkin) {
    return `
════════════════════════════════════════
CHECK-IN DATA
════════════════════════════════════════
No check-in for Week ${weekNumber - 1}. Use blueprint defaults.
`.trim();
  }

  const volumeSignal =
    checkin.workoutCompletionRate >= 90
      ? 'INCREASE volume or intensity slightly — athlete is recovering well'
      : checkin.workoutCompletionRate >= 70
        ? 'MAINTAIN current volume — athlete completing most sessions'
        : 'REDUCE volume by 10-15% — athlete is struggling to complete sessions';

  const nutritionSignal =
    checkin.mealCompletionRate >= 85
      ? 'Adherence excellent — keep same nutrition targets'
      : checkin.mealCompletionRate >= 65
        ? 'Adherence moderate — simplify meals slightly if needed'
        : 'Adherence poor — significantly simplify meal structure';

  const recoverySignal =
    checkin.energyLevel <= 4 || checkin.recoveryLevel <= 4
      ? 'LOW recovery — reduce workout intensity by 10%, ensure deload exercises if week 4'
      : checkin.energyLevel >= 8 && checkin.recoveryLevel >= 8
        ? 'HIGH recovery — athlete can handle full progressive overload'
        : 'NORMAL recovery — follow standard progression';

  return `
════════════════════════════════════════
WEEK ${checkin.weekNumber} CHECK-IN DATA
════════════════════════════════════════
Current weight:         ${checkin.currentWeight} kg
Workout completion:     ${checkin.workoutCompletionRate}%
Meal completion:        ${checkin.mealCompletionRate}%
Energy level:           ${checkin.energyLevel}/10
Recovery level:         ${checkin.recoveryLevel}/10
${checkin.notes ? `Athlete notes: "${checkin.notes}"` : ''}

ADJUSTMENTS FOR THIS WEEK:
  → Training:   ${volumeSignal}
  → Nutrition:  ${nutritionSignal}
  → Recovery:   ${recoverySignal}
`.trim();
};

const buildRagContext = (ragContext: string): string => {
  if (!ragContext || ragContext === 'No specific knowledge base context found.')
    return '';
  return `
════════════════════════════════════════
KILO METHODOLOGY KNOWLEDGE BASE
════════════════════════════════════════
${ragContext}
`.trim();
};

// ─────────────────────────────────────────────────────────────────────────────
// Main prompt builder
// ─────────────────────────────────────────────────────────────────────────────

export const buildWeeklyPlanPrompt = (
  user: INormalUser,
  blueprint: IBlueprintDocument,
  weekNumber: number,
  startDate: string,
  ragContext: string,
  previousPlan?: IWeeklyPlanDocument | null,
  checkin?: IWeeklyCheckinDocument | null,
): string => {
  // Inject mealsPerDay into schema string
  const schema = STRICT_WEEKLY_PLAN_SCHEMA.replace(
    /{MEALS_PER_DAY}/g,
    String(user.mealsPerDay),
  );

  return `
You are an elite strength coach and sports nutritionist certified in KILO Strength Society methodology.

Generate the training and nutrition TEMPLATES for Week ${weekNumber} of a 30-day programme.

IMPORTANT: You are generating TWO reusable templates, NOT 7 individual daily plans:
  - workoutDayTemplate: used on every training day this week (nutrition + workout)
  - restDayTemplate: used on every rest day this week (nutrition only, no workout)

Return ONLY valid JSON. No markdown. No explanation. No text outside the JSON.

════════════════════════════════════════
USER PROFILE
════════════════════════════════════════
Name:              ${user.name}
Age:               ${user.age} years
Gender:            ${user.gender ?? 'Not specified'}
Weight:            ${user.weight} kg
Height:            ${user.height} cm
Goal:              ${user.fitnessGoal}
Experience:        ${user.experienceLevel}
Activity level:    ${user.activityLevel}
Training days/wk:  ${user.daysPerWeek}
Meals per day:     ${user.mealsPerDay}
Dietary prefs:     ${user.dietaryPreferences?.join(', ') || 'None'}
Injuries:          ${user.injuries?.length ? user.injuries.join(', ') : 'None'}
${user.additionalNoteForInjuries ? `Injury notes:      ${user.additionalNoteForInjuries}` : ''}
Equipment:         ${user.availableEquipment?.join(', ') || 'Standard commercial gym'}
Warmup included:   ${user.includeWarmup ? 'Yes' : 'No'}
Preferred workout: ${user.preferredWorkoutTime}

${buildBlueprintContext(blueprint, weekNumber)}

${buildCheckinContext(checkin, weekNumber)}

${buildPreviousWeekContext(previousPlan)}

${buildRagContext(ragContext)}

════════════════════════════════════════
GENERATION RULES
════════════════════════════════════════
1.  Generate ONLY workoutDayTemplate and restDayTemplate — do NOT generate 7 daily plans.
2.  workoutDayTemplate.nutritionPlan must have exactly ${user.mealsPerDay} meal(s).
3.  restDayTemplate.nutritionPlan must have exactly ${user.mealsPerDay} meal(s).
4.  restDayTemplate calories must be 10-20% lower than workoutDayTemplate calories.
5.  restDayTemplate protein must equal workoutDayTemplate protein (recovery requires same protein).
6.  restDayTemplate has NO workoutPlan — it is a nutrition-only template.
7.  Meal macros must sum to ≈ nutritionPlan targets (±5% tolerance).
8.  All exercises MUST use only this equipment: ${user.availableEquipment?.join(', ') || 'all equipment'}.
9.  MUST NOT prescribe exercises aggravating: ${user.injuries?.length ? user.injuries.join(', ') : 'none'}.
10. Front Squat and Deadlift A-series MUST never exceed 6 reps.
11. ${user.experienceLevel === 'beginner' ? 'BEGINNER: Standard Sets only (constant or step loading).' : 'Follow KILO rep scheme progression for this phase.'}
12. ${user.includeWarmup ? 'Warm-up MUST follow KILO protocol: 2 sets if first working set ≥7 reps, 3 sets if <7 reps.' : 'Skip warm-up sets.'}
13. workoutPlan.workoutType and workoutPlan.focus must match the blueprint workout day schedule.
14. Apply all check-in adjustment signals — do NOT ignore them.
15. For Week 2-4: show clear progression from previous week's template.

════════════════════════════════════════
EXACT JSON SCHEMA TO RETURN
════════════════════════════════════════
${schema}
`.trim();
};
