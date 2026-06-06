// src/modules/weeklyPlan/weeklyPlan.model.ts

import { model, Schema } from 'mongoose';
import {
  IWeeklyCheckinDocument,
  IWeeklyPlanDocument,
} from './weeklyPlan.interface';

// ─────────────────────────────────────────────────────────────────────────────
// Shared nutrition sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

const FoodAlternativeSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
  },
  { _id: false },
);

const FoodSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    alternatives: { type: [FoodAlternativeSchema], default: [] },
  },
  { _id: false },
);

const MealSchema = new Schema(
  {
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    targetCalories: { type: Number, required: true },
    targetProtein: { type: Number, required: true },
    targetCarbs: { type: Number, required: true },
    targetFat: { type: Number, required: true },
    foods: { type: [FoodSchema], required: true },
  },
  { _id: false },
);

const NutritionPlanSchema = new Schema(
  {
    targetCalories: { type: Number, required: true },
    targetProtein: { type: Number, required: true },
    targetCarbs: { type: Number, required: true },
    targetFat: { type: Number, required: true },
    meals: { type: [MealSchema], required: true },
  },
  { _id: false },
);

// ─────────────────────────────────────────────────────────────────────────────
// Workout sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

const ExerciseAlternativeSchema = new Schema(
  { name: { type: String, required: true } },
  { _id: false },
);

const ExerciseSchema = new Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
    restSeconds: { type: Number, required: true },
    targetMuscles: { type: [String], default: [] },
    instructions: { type: [String], default: [] },
    alternatives: { type: [ExerciseAlternativeSchema], default: [] },
  },
  { _id: false },
);

const WorkoutPlanSchema = new Schema(
  {
    workoutType: { type: String, required: true },
    focus: { type: String, required: true },
    estimatedDurationMinutes: { type: Number, required: true },
    warmup: { type: [ExerciseSchema], default: [] },
    exercises: { type: [ExerciseSchema], required: true },
    cooldown: { type: [ExerciseSchema], default: [] },
  },
  { _id: false },
);

// ─────────────────────────────────────────────────────────────────────────────
// Template sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

const WorkoutDayTemplateSchema = new Schema(
  {
    nutritionPlan: { type: NutritionPlanSchema, required: true },
    workoutPlan: { type: WorkoutPlanSchema, required: true },
  },
  { _id: false },
);

const RestDayTemplateSchema = new Schema(
  {
    nutritionPlan: { type: NutritionPlanSchema, required: true },
  },
  { _id: false },
);

// Lightweight per-day metadata — no meal/exercise data repeated here
const WeekDayMetaSchema = new Schema(
  {
    day: { type: Number, required: true, min: 1, max: 7 },
    date: { type: String, required: true },
    isWorkoutDay: { type: Boolean, required: true },
    workoutType: { type: String, required: true },
    focus: { type: String, required: true },
  },
  { _id: false },
);

// ─────────────────────────────────────────────────────────────────────────────
// Weekly plan model
// ─────────────────────────────────────────────────────────────────────────────

const WeeklyPlanSchema = new Schema<IWeeklyPlanDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    blueprintId: {
      type: Schema.Types.ObjectId,
      ref: 'Blueprint',
      required: true,
      index: true,
    },
    weekNumber: { type: Number, required: true, min: 1, max: 4 },
    phase: { type: String, required: true },
    objective: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    schedule: {
      type: [WeekDayMetaSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length === 7,
        message: 'schedule must contain exactly 7 entries',
      },
    },
    workoutDayTemplate: { type: WorkoutDayTemplateSchema, required: true },
    restDayTemplate: { type: RestDayTemplateSchema, required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

WeeklyPlanSchema.index({ blueprintId: 1, weekNumber: 1 }, { unique: true });
WeeklyPlanSchema.index({ userId: 1, weekNumber: 1 });

export const WeeklyPlan = model<IWeeklyPlanDocument>(
  'WeeklyPlan',
  WeeklyPlanSchema,
);

// ─────────────────────────────────────────────────────────────────────────────
// Weekly check-in model  (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

const WeeklyCheckinSchema = new Schema<IWeeklyCheckinDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    blueprintId: {
      type: Schema.Types.ObjectId,
      ref: 'Blueprint',
      required: true,
    },
    weeklyPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'WeeklyPlan',
      required: true,
    },
    weekNumber: { type: Number, required: true, min: 1, max: 4 },
    currentWeight: { type: Number, required: true, min: 0 },
    workoutCompletionRate: { type: Number, required: true, min: 0, max: 100 },
    mealCompletionRate: { type: Number, required: true, min: 0, max: 100 },
    energyLevel: { type: Number, required: true, min: 1, max: 10 },
    recoveryLevel: { type: Number, required: true, min: 1, max: 10 },
    notes: { type: String, required: false },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

WeeklyCheckinSchema.index({ blueprintId: 1, weekNumber: 1 }, { unique: true });

export const WeeklyCheckin = model<IWeeklyCheckinDocument>(
  'WeeklyCheckin',
  WeeklyCheckinSchema,
);
