import { model, Schema } from "mongoose";
import { ENUM_ACTIVITY_LEVEL, ENUM_EXPERIENCE_LEVEL } from "./normalUser.enum";
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
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    age:{
        type: Number,
        required: true,
    },
    height:{
        type: Number,
        required: true,
    },
    weight:{
        type: Number,
        required: true,
    },
    fitnessGoal:{
        type: String,
        required: true,
    },
    experienceLevel:{
        type: String,
        enum:Object.values(ENUM_EXPERIENCE_LEVEL),
        required: true,
    },
    dietaryPreferences:{
        type: [String],
        required: false,
    },
    activityLevel:{
        type: String,
        enum:Object.values(ENUM_ACTIVITY_LEVEL),
        required: true,
    },
    injuries:{
        type: [String],
        required: false,
    },
    additionalNoteForInjuries:{
        type: String,
        required: false,
    },
    mealsPerDay:{
        type: Number,
        required: true,
    },
    wakeUpTime:{
        type: String,
        required: true,
    },
    bedTime:{
        type: String,
        required: true,
    },
    preferredWorkoutTime:{
        type: String,
        required: true,
    },
});

export const NormalUser = model<INormalUser>('NormalUser', NormalUserSchema);   