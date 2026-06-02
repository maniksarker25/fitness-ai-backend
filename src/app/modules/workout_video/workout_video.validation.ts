import { z } from 'zod';
import {
  workoutVideoCategories,
  workoutVideoDifficulties,
} from './workout_video.constant';

const exerciseSchema = z.object({
  name: z.string().trim().min(1),
  sets: z.number().int().min(1),
  reps: z.string().trim().min(1),
  restSeconds: z.number().int().min(0),
});

const createWorkoutVideoValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1),
    slug: z.string().trim().min(1),
    description: z.string().trim().min(1),
    thumbnail: z.string().trim().min(1),
    video_url: z.string().trim().min(1),
    durationInMinutes: z.number().positive(),
    category: z.enum(workoutVideoCategories),
    difficulty: z.enum(workoutVideoDifficulties).optional(),
    estimatedCalories: z.number().min(0).optional(),
    tags: z.array(z.string().trim().min(1)).default([]),
    covers: z.array(z.string().trim().min(1)).default([]),
    exercises: z.array(exerciseSchema).default([]),
    isFeatured: z.boolean().optional(),
    totalViews: z.number().int().min(0).optional(),
  }),
});

const updateWorkoutVideoValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).optional(),
    slug: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    thumbnail: z.string().trim().min(1).optional(),
    video_url: z.string().trim().min(1).optional(),
    durationInMinutes: z.number().positive().optional(),
    category: z.enum(workoutVideoCategories).optional(),
    difficulty: z.enum(workoutVideoDifficulties).optional(),
    estimatedCalories: z.number().min(0).optional(),
    tags: z.array(z.string().trim().min(1)).optional(),
    covers: z.array(z.string().trim().min(1)).optional(),
    exercises: z.array(exerciseSchema).optional(),
    isFeatured: z.boolean().optional(),
    totalViews: z.number().int().min(0).optional(),
  }),
});

export const workoutVideoValidation = {
  createWorkoutVideoValidationSchema,
  updateWorkoutVideoValidationSchema,
};
