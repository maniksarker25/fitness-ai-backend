import { Schema, model } from 'mongoose';
import { IWorkoutVideo } from './workout_video.interface';

const ExerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sets: {
      type: Number,
      required: true,
      min: 1,
    },
    reps: {
      type: String,
      required: true,
    },
    restSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const WorkoutVideoSchema = new Schema<IWorkoutVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    video_url: {
      type: String,
      required: true,
    },
    durationInMinutes: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'push',
        'pull',
        'legs',
        'full-body',
        'cardio',
        'abs',
        'mobility',
        'custom',
      ],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },

    estimatedCalories: {
      type: Number,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    covers: [
      {
        type: String,
        trim: true,
      },
    ],

    exercises: [ExerciseSchema],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    totalViews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const WorkoutVideo = model('WorkoutVideo', WorkoutVideoSchema);
