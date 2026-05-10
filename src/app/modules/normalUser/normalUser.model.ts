import { model, Schema } from "mongoose";
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
});

export const NormalUser = model<INormalUser>('NormalUser', NormalUserSchema);   