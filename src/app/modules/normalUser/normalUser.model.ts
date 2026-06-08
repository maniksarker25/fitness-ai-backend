import { model, Schema } from "mongoose";
import { ENUM_ACTIVITY_LEVEL, ENUM_EQUIPMENT, ENUM_EXPERIENCE_LEVEL, ENUM_FITNESS_GOAL, ENUM_GENDER } from "./normalUser.enum";
import { INormalUser } from "./normalUser.interface";

const NormalUserSchema = new Schema<INormalUser>({
    user: {
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
        default:""
    },
    profile_image: {
        type: String,
        required: false,
        default:""
    },
    gender: {
        type: String,
        enum: Object.values(ENUM_GENDER),
        required: false,
    },
    bio: {
        type: String,
        required: false,
        default:""
    },
    age: {
        type: Number,
        min: 13,
        max: 80,
    },
    height: {
        type: Number,
        default:null
    },
    weight: {
        type: Number,
        default:null
    },
    fitnessGoal: {
        type: String,
        enum: Object.values(ENUM_FITNESS_GOAL),
        default:null
    },
    experienceLevel: {
        type: String,
        enum: Object.values(ENUM_EXPERIENCE_LEVEL),
        default:null
    },
    daysPerWeek: {
        type: Number,
        enum: [2, 3, 4, 5],
        default:null
    },
    availableEquipment: {
        type: [String],
        enum: Object.values(ENUM_EQUIPMENT),
       default:null
    },
    activityLevel: {
        type: String,
        enum: Object.values(ENUM_ACTIVITY_LEVEL),
        default:null
    },
    injuries: {
        type: [String],
        required: false,
        default: [],
    },
    additionalNoteForInjuries: {
        type: String,
        default:null
    },
    dietaryPreferences: {
        type: [String],
        required: false,
        default: [],
    },
    mealsPerDay: {
        type: Number,
        min: 1,
        max: 8,
        default:null
    },
    wakeUpTime: {
        type: String,
        default:null
    },
    bedTime: {
        type: String,
        default:null
    },
    preferredWorkoutTime: {
        type: String,
        default:null
    },
    includeWarmup: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

export const NormalUser = model<INormalUser>('NormalUser', NormalUserSchema);