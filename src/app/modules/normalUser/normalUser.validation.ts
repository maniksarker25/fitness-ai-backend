import { z } from 'zod';
import { ENUM_ACTIVITY_LEVEL, ENUM_EXPERIENCE_LEVEL } from './normalUser.enum';




const updateNormalUserValidationSchema = z.object({
  body: z.object({
    name:z.string().optional(),
    phone: z.string().optional(),
    age:z.number().optional(),
    height:z.number().optional(),
    weight:z.number().optional(),
    fitnessGoal:z.string().optional(),
    experienceLevel:z.nativeEnum(ENUM_EXPERIENCE_LEVEL).optional(),
    dietaryPreferences:z.array(z.string()).optional(),
    activityLevel:z.nativeEnum(ENUM_ACTIVITY_LEVEL).optional(),
    injuries:z.array(z.string()).optional(),
    additionalNoteForInjuries:z.string().optional(),
    mealsPerDay:z.number().optional(),
    wakeUpTime:z.string().optional(),
    bedTime:z.string().optional(),
    preferredWorkoutTime:z.string().optional(),
  }),
});

export const normalUserValidation = {
  updateNormalUserValidationSchema,
};
