import { INormalUser } from '../../normalUser/normalUser.interface';

export const buildBlueprintPrompt = (user: INormalUser, ragContext: string) => {
  return `
You are an elite strength coach and sports nutritionist.

Create a scientifically sound 30-day fitness blueprint.

User Profile:

${JSON.stringify(user, null, 2)}

Knowledge Base:

${ragContext}

Requirements:

- Goal specific
- Respect injuries
- Respect available equipment
- Respect experience level
- Respect activity level
- Respect dietary preferences
- Create exactly 4 weeks
- Create a weekly workout schedule
- Create nutrition strategy
- Create progression strategy
- Create recovery strategy

Return ONLY valid JSON.

Schema:

{
  "goal": "string",

  "durationDays": 30,

  "weeklyPhases": [
    {
      "week": 1,
      "phase": "string",
      "objective": "string",
      "intensity": 1
    }
  ],

  "nutritionStrategy": {
    "targetCalories": 0,
    "targetProtein": 0,
    "targetCarbs": 0,
    "targetFat": 0,
    "hydrationTargetLiters": 0
  },

  "progressionStrategy": {
    "type": "string",
    "description": "string"
  },

  "recoveryStrategy": {
    "sleepTargetHours": 8,
    "restDaysPerWeek": 2
  },

  "weeklySchedule": [
    {
      "dayOfWeek": 1,
      "workoutType": "string",
      "focus": "string",
      "isWorkoutDay": true
    }
  ]
}
`;
};
