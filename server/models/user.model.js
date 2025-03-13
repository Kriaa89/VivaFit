import {model, Schema} from 'mongoose';
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    firstName : {
        type : String,
        required : [true, "First name is required"], 
        trim: true,
        minlength: [2, "First name must be at least 2 characters"],
        maxlength: [30, "First name cannot exceed 30 characters"]
    },
    lastName : { 
        type : String,
        required : [true, "Last name is required"], 
        trim: true,
        minlength: [2, "Last name must be at least 2 characters"],
        maxlength: [30, "Last name cannot exceed 30 characters"]
    },
    age : {
        type : Number,
        required : [true, "Age is required"], 
        min : [0, "Age cannot be negative"],
        max : [120, "Age cannot exceed 120"]
    },
    height : {
        type : Number,
        required : [true, "Height is required"], 
        min : [0, "Height cannot be negative"],
        unit : {
            type : String,
            enum : ["cm", "m", "in", "ft"],
            default : "cm"
        }
    },
    weight : {
        type : Number,
        required : [true, "Weight is required"], 
        min : [0, "Weight cannot be negative"],
        unit : {
            type : String,
            enum : ["kg", "lb"],
            default : "kg"
        }
    },
    fitnessLevel : {
        type : String,
        enum : ["beginner", "intermediate", "advanced"],
        default : "beginner"
    },
    fitnessGoal : {
        type : String,
        enum : ["weight loss", "muscle gain", "endurance", "maintenance", "flexibility", "general fitness"],
        required: [true, "Fitness goal is required"]
    },
    availableEquipment : {
        type : String,
    },
    workoutPreference : {
        type : String,
        enum : ["home", "gym", "outdoor"],
        default : "home"
    },
    workoutTime : {
        type : String,
        enum : ["morning", "afternoon", "evening"],
        default : "morning"
    },
    workoutDays : {
        type : String,
        enum : ["1-2 days", "3-4 days", "5-6 days"],
        default : "3-4 days"
    },
    workoutDuration : {
        type : String,
        enum : ["30 minutes", "1 hour", "1.5 hours", "2 hours"],
        default : "1 hour"
    },
    BodyType : {
        type : String,
        enum : ["ectomorph", "mesomorph", "endomorph"],
        default : "ectomorph"
    },
    email : {
        type : String,
        required : [true, "Email is required"], 
        unique : true,
        validate : {
            validator : function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message : "Please enter a valid email address"
        }
    },
    password : {
        type : String,
        required : [true, "Password is required"], 
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
}, {
    timestamps : true,
});
const User = model("User", UserSchema);
export default User;