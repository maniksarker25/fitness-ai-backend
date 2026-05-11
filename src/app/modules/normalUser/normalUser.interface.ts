import { Types } from "mongoose";
import { ENUM_ACTIVITY_LEVEL, ENUM_EXPERIENCE_LEVEL } from "./normalUser.enum";

export interface INormalUser {
    userId: Types.ObjectId;
    email: string;
    name: string;
    phone: string;
    profile_image?: string;
    gender?: "Male" | "Female" | "Other";
    bio?: string;
    age:number;
    height:number;
    weight:number;
    fitnessGoal:string;
    experienceLevel:ENUM_EXPERIENCE_LEVEL;
    dietaryPreferences:string[];
    activityLevel:ENUM_ACTIVITY_LEVEL;
    injuries:string[];
    additionalNoteForInjuries?:string;
    mealsPerDay:number;
    wakeUpTime:string;
    bedTime:string;
    preferredWorkoutTime: string;
}