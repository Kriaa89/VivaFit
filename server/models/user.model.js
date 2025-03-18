import {model, Schema} from 'mongoose';

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
        exercises: [{
            id: String,
            name: String,
            bodyPart: String
        }]
    }],
    age: {
        type: Number,
        min: [13, "Must be at least 13 years old"],
        max: [120, "Age must not exceed 120"],
        required: [true, "Age is required"]
    },
    weight: {
        type: Number,
        min: [20, "Weight must be at least 20"],
        required: [true, "Weight is required"]
    },
    weightUnit: {
        type: String,
        enum: {
            values: ["kg", "lb"],
            message: "Weight unit must be either kg or lb"
        },
        default: "kg"
    },
    height: {
        type: Number,
        required: [true, "Height is required"]
    },
    heightUnit: {
        type: String,
        enum: {
            values: ["cm", "m", "ft", "in"],
            message: "Height unit must be one of: cm, m, ft, in"
        },
        default: "cm"
    },
    fitnessLevel: {
        type: String,
        enum: {
            values: ["beginner", "intermediate", "advanced"],
            message: "Fitness level must be beginner, intermediate, or advanced"
        },
        default: "beginner"
    },
    fitnessGoal: {
        type: String,
        enum: {
            values: ["weight loss", "muscle gain", "endurance", "strength", "flexibility", "general fitness"],
            message: "Invalid fitness goal selected"
        },
        default: "general fitness"
    },
    workoutPreferences: {
        type: String,
        trim: true
    },
    dietaryRestrictions: {
        type: String,
        trim: true
    },
    preferredWorkoutTimes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default model('User', UserSchema);