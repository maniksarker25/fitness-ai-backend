import { Types } from "mongoose";
import { ENUM_ACTIVITY_LEVEL, ENUM_EXPERIENCE_LEVEL, ENUM_GENDER } from "./normalUser.enum";

export interface INormalUser {
    userId: Types.ObjectId;
    email: string;
    name: string;
    phone: string;
    profile_image?: string;
    gender?: (typeof ENUM_GENDER)[keyof typeof ENUM_GENDER];
    bio?: string;
    age:number;
    height:number;
    weight:number;
    fitnessGoal:string;
    experienceLevel:(typeof ENUM_EXPERIENCE_LEVEL)[keyof typeof ENUM_EXPERIENCE_LEVEL];
    dietaryPreferences:string[];
    activityLevel:(typeof ENUM_ACTIVITY_LEVEL)[keyof typeof ENUM_ACTIVITY_LEVEL];
    injuries:string[];
    additionalNoteForInjuries?:string;
    mealsPerDay:number;
    wakeUpTime:string;
    bedTime:string;
    preferredWorkoutTime: string;
}