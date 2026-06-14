// src/modules/weeklyPlan/weeklyPlan.interface.ts

import { Document, Types } from 'mongoose';
import { IBlueprintDocument } from '../blueprint/blueprint.interface';
import { INormalUser } from '../normalUser/normalUser.interface';

// Shared nutrition sub-documents

export interface IFoodAlternative {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface IFood {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  alternatives: IFoodAlternative[];
}

export interface IMeal {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  foods: IFood[];
}

export interface INutritionPlan {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: IMeal[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Workout sub-documents
// ─────────────────────────────────────────────────────────────────────────────

export interface IExerciseAlternative {
  name: string;
}

export interface IExercise {
  name: string;
  sets: number;
  reps: string; // string — allows "8-10", "AMRAP", "30 seconds"
  restSeconds: number;
  targetMuscles: string[];
  instructions: string[];
  alternatives: IExerciseAlternative[];
}

export interface IWorkoutPlan {
  workoutType: string;
  focus: string;
  estimatedDurationMinutes: number;
  warmup: IExercise[];
  exercises: IExercise[];
  cooldown: IExercise[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Two-template weekly plan
//
// Instead of 7 individual daily plans (redundant data), the weekly plan
// stores exactly two templates:
//
//   workoutDayTemplate  — used on every training day this week
//   restDayTemplate     — used on every rest day this week
//
// Which days are workout vs rest is determined by the blueprint's
// weeklySchedule. The frontend/client maps the template onto each date.
// ─────────────────────────────────────────────────────────────────────────────

export interface IWorkoutDayTemplate {
  nutritionPlan: INutritionPlan; // higher carbs — fuels training
  workoutPlan: IWorkoutPlan;
}

export interface IRestDayTemplate {
  nutritionPlan: INutritionPlan; // lower carbs — recovery focused
}

// Lightweight schedule entry so the client knows which template to apply
// on which date without re-fetching the blueprint
export interface IWeekDayMeta {
  day: number; // 1 (Mon) – 7 (Sun)
  date: string; // YYYY-MM-DD
  isWorkoutDay: boolean;
  workoutType: string; // "Upper Body" | "Lower Body" | "Rest" etc.
  focus: string; // "Overhead Press + Chin-Up" | "Rest"
}

// ─────────────────────────────────────────────────────────────────────────────
// Weekly plan root document
// ─────────────────────────────────────────────────────────────────────────────

export interface IWeeklyPlan {
  userId: Types.ObjectId;
  blueprintId: Types.ObjectId;
  weekNumber: number; // 1–4
  phase: string; // "Accumulation" | "Intensification" | "Deload" | "Peak"
  objective: string;
  startDate: Date; // YYYY-MM-DD (Monday)
  endDate: Date; // YYYY-MM-DD (Sunday)
  schedule: IWeekDayMeta[]; // always 7 — lightweight day metadata
  workoutDayTemplate: IWorkoutDayTemplate;
  restDayTemplate: IRestDayTemplate;
  generatedAt: Date;
}

export interface IWeeklyPlanDocument extends IWeeklyPlan, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Weekly check-in
// ─────────────────────────────────────────────────────────────────────────────

export interface IWeeklyCheckin {
  userId: Types.ObjectId;
  blueprintId: Types.ObjectId;
  weeklyPlanId: Types.ObjectId;
  weekNumber: number;
  currentWeight: number; // kg
  workoutCompletionRate: number; // 0–100
  mealCompletionRate: number; // 0–100
  energyLevel: number; // 1–10
  recoveryLevel: number; // 1–10
  notes?: string;
  submittedAt: Date;
}

export interface IWeeklyCheckinDocument extends IWeeklyCheckin, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Service I/O types
// ─────────────────────────────────────────────────────────────────────────────

export interface IGenerateWeeklyPlanInput {
  user: INormalUser;
  blueprint: IBlueprintDocument;
  weekNumber: number;
  startDate: string;
  previousPlan?: IWeeklyPlanDocument | null;
  checkin?: IWeeklyCheckinDocument | null;
}

export interface IGenerateWeeklyPlanResult {
  weeklyPlanId: string;
  weeklyPlan: IWeeklyPlanDocument;
}

export interface ISubmitCheckinInput {
  userId: string;
  blueprintId: string;
  weeklyPlanId: string;
  weekNumber: number;
  currentWeight: number;
  workoutCompletionRate: number;
  mealCompletionRate: number;
  energyLevel: number;
  recoveryLevel: number;
  notes?: string;
}
