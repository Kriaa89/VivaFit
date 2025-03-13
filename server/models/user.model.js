import {model, Schema} from 'mongoose';
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    firebaseUID: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: [true, "First name is required"], 
        trim: true,
        minlength: [2, "First name must be at least 2 characters"],
        maxlength: [30, "First name cannot exceed 30 characters"]
    },
    lastName: { 
        type: String,
        required: [true, "Last name is required"], 
        trim: true,
        minlength: [2, "Last name must be at least 2 characters"],
        maxlength: [30, "Last name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"], 
        unique: true,
        validate: {
            validator: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Please enter a valid email address"
        }
    },
    age: {
        type: Number,
        min: [0, "Age cannot be negative"],
        max: [120, "Age cannot exceed 120"]
    },
    // Keep the rest of your user model as is
    height: {
        type: Number,
        min: [0, "Height cannot be negative"],
        unit: {
            type: String,
            enum: ["cm", "m", "in", "ft"],
            default: "cm"
        }
    },
    weight: {
        type: Number,
        min: [0, "Weight cannot be negative"],
        unit: {
            type: String,
            enum: ["kg", "lb"],
            default: "kg"
        }
    },
    fitnessLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
    },
    fitnessGoal: {
        type: String,
        enum: ["weight loss", "muscle gain", "endurance", "maintenance", "flexibility", "general fitness"]
    },
    // Remove password field as Firebase handles authentication
}, {
    timestamps: true,
});

const User = model("User", UserSchema);
export default User;