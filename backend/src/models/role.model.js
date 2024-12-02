import mongoose from "mongoose";

const Role = mongoose.model(
    "Role",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            enum: ['user', 'admin', 'moderator']
        },
        description: {
            type: String,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    })
);

export default Role;