// src/modules/blueprint/blueprint.interface.ts

import { Document, Types } from 'mongoose';

// ── RAG ──────────────────────────────────────────────────────────────────────

export interface IRagChunkMetadata {
  source: string;
  section: string;
  phase: string;
  topic: string;
  text: string;
  goal: string[];
  level: string[];
  intensityRange?: string;
  frequency?: number;
}

// ── Blueprint sub-documents ───────────────────────────────────────────────────

export interface IWeeklyPhase {
  week: number; // 1–4
  phase: string; // e.g. "Accumulation", "Intensification"
  objective: string; // human-readable week goal
  intensity: number; // 1–10 perceived intensity scale
}

export interface INutritionStrategy {
  targetCalories: number;
  targetProtein: number; // grams
  targetCarbs: number; // grams
  targetFat: number; // grams
  hydrationTargetLiters: number;
}

export interface IProgressionStrategy {
  type: string; // e.g. "Linear", "Wave", "Step"
  description: string;
}

export interface IRecoveryStrategy {
  sleepTargetHours: number;
  restDaysPerWeek: number;
}

export interface IWeeklyScheduleDay {
  dayOfWeek: number; // 1 = Monday … 7 = Sunday
  workoutType: string; // "Upper Body", "Lower Body", "Full Body", "Rest"
  focus: string; // e.g. "Overhead Press + Chin-Up"
  isWorkoutDay: boolean;
}

// ── Blueprint root ─────────────────────────────────────────────────────────────

export interface IBlueprint {
  goal: string;
  durationDays: 30;
  weeklyPhases: IWeeklyPhase[]; // exactly 4 items
  nutritionStrategy: INutritionStrategy;
  progressionStrategy: IProgressionStrategy;
  recoveryStrategy: IRecoveryStrategy;
  weeklySchedule: IWeeklyScheduleDay[];
}

// ── MongoDB document ──────────────────────────────────────────────────────────

export interface IBlueprintDocument extends IBlueprint, Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Service return type ───────────────────────────────────────────────────────

export interface IBlueprintGenerationResult {
  blueprintId: string;
  blueprint: IBlueprintDocument;
}
