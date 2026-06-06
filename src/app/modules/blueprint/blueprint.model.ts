// src/modules/blueprint/blueprint.model.ts

import { model, Schema } from 'mongoose';
import { IBlueprintDocument } from './blueprint.interface';

const WeeklyPhaseSchema = new Schema(
  {
    week: { type: Number, required: true, min: 1, max: 4 },
    phase: { type: String, required: true },
    objective: { type: String, required: true },
    intensity: { type: Number, required: true, min: 1, max: 10 },
  },
  { _id: false },
);

const NutritionStrategySchema = new Schema(
  {
    targetCalories: { type: Number, required: true },
    targetProtein: { type: Number, required: true },
    targetCarbs: { type: Number, required: true },
    targetFat: { type: Number, required: true },
    hydrationTargetLiters: { type: Number, required: true },
  },
  { _id: false },
);

const ProgressionStrategySchema = new Schema(
  {
    type: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const RecoveryStrategySchema = new Schema(
  {
    sleepTargetHours: { type: Number, required: true },
    restDaysPerWeek: { type: Number, required: true },
  },
  { _id: false },
);

const WeeklyScheduleDaySchema = new Schema(
  {
    dayOfWeek: { type: Number, required: true, min: 1, max: 7 },
    workoutType: { type: String, required: true },
    focus: { type: String, required: true },
    isWorkoutDay: { type: Boolean, required: true },
  },
  { _id: false },
);

const BlueprintSchema = new Schema<IBlueprintDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    goal: { type: String, required: true },
    durationDays: { type: Number, required: true, default: 30 },
    weeklyPhases: {
      type: [WeeklyPhaseSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length === 4,
        message: 'weeklyPhases must contain exactly 4 items',
      },
    },
    nutritionStrategy: { type: NutritionStrategySchema, required: true },
    progressionStrategy: { type: ProgressionStrategySchema, required: true },
    recoveryStrategy: { type: RecoveryStrategySchema, required: true },
    weeklySchedule: { type: [WeeklyScheduleDaySchema], required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

// Compound index: fast lookup for a user's blueprint history
BlueprintSchema.index({ userId: 1, generatedAt: -1 });

export const Blueprint = model<IBlueprintDocument>(
  'Blueprint',
  BlueprintSchema,
);
