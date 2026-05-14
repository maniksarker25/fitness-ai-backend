import { model, Schema } from "mongoose";
import { ENUM_ACTIVITY_LEVEL, ENUM_EQUIPMENT, ENUM_EXPERIENCE_LEVEL, ENUM_FITNESS_GOAL, ENUM_GENDER } from "./normalUser.enum";
import { INormalUser } from "./normalUser.interface";

const NormalUserSchema = new Schema<INormalUser>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    profile_image: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        enum: Object.values(ENUM_GENDER),
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    age: {
        type: Number,
        required: true,
        min: 13,
        max: 80,
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    fitnessGoal: {
        type: String,
        enum: Object.values(ENUM_FITNESS_GOAL),
        required: true,
    },
    experienceLevel: {
        type: String,
        enum: Object.values(ENUM_EXPERIENCE_LEVEL),
        required: true,
    },
    daysPerWeek: {
        type: Number,
        enum: [2, 3, 4, 5],
        required: true,
    },
    availableEquipment: {
        type: [String],
        enum: Object.values(ENUM_EQUIPMENT),
        required: true,
    },
    activityLevel: {
        type: String,
        enum: Object.values(ENUM_ACTIVITY_LEVEL),
        required: true,
    },
    injuries: {
        type: [String],
        required: false,
        default: [],
    },
    additionalNoteForInjuries: {
        type: String,
        required: false,
    },
    dietaryPreferences: {
        type: [String],
        required: false,
        default: [],
    },
    mealsPerDay: {
        type: Number,
        required: true,
        min: 1,
        max: 8,
    },
    wakeUpTime: {
        type: String,
        required: true,
    },
    bedTime: {
        type: String,
        required: true,
    },
    preferredWorkoutTime: {
        type: String,
        required: true,
    },
    includeWarmup: {
        type: Boolean,
        required: false,
        default: true,
    },
}, {
    timestamps: true,
});

export const NormalUser = model<INormalUser>('NormalUser', NormalUserSchema);