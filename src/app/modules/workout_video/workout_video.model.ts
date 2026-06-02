import { Schema, model } from 'mongoose';

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

const WorkoutVideoSchema = new Schema(
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

    video: {
      provider: {
        type: String,
        enum: ['youtube', 'vimeo', 'upload', 'other'],
        required: true,
      },

      url: {
        type: String,
        required: true,
      },

      durationInMinutes: {
        type: Number,
        required: true,
      },
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

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const WorkoutVideo = model('WorkoutVideo', WorkoutVideoSchema);
