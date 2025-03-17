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
    recommendations: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        criteria: {
            bodyType: String,
            equipment: String,
            goal: String,
            fitnessLevel: String
        },
        exercises: [{
            id: String,
            name: String,
            bodyPart: String
        }]
    }],
    age: {
        type: Number,
        min: [13, "Must be at least 13 years old"],
        max: [120, "Age must not exceed 120"]
    },
    weight: {
        type: Number,
        min: [20, "Weight must be at least 20"]
    },
    weightUnit: {
        type: String,
        enum: ["kg", "lb"],
        default: "kg"
    },
    height: {
        type: Number,
        min: [50, "Height must be at least 50"]
    },
    heightUnit: {
        type: String,
        enum: ["cm", "in"],
        default: "cm"
    },
    fitnessLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
    },
    fitnessGoal: {
        type: String,
        enum: ["weight loss", "muscle gain", "endurance", "strength", "flexibility", "overall fitness"],
        default: "overall fitness"
    }
}, { timestamps: true });

export default model('User', UserSchema);