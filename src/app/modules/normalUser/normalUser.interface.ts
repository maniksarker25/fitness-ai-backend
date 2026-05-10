import { Types } from "mongoose";

export interface INormalUser {
    userId: Types.ObjectId;
    email: string;
    name: string;
    phone: string;
    profile_image?: string;
    gender?: "male" | "female" | "other";
    bio?: string;
}