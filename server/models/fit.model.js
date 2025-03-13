import mongoose from "mongoose";
import bcrypt from "bcrypt";

const fitSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "First name is required"], 
        trim: true,
        minlength: [2, "First name must be at least 2 characters"],
        maxlength: [30, "First name cannot exceed 30 characters"]
    },
    lasName : {
        type : String,
        required : [true, "Last name is required"], 
        trim: true,
        minlength: [2, "Last name must be at least 2 characters"],
        maxlength: [30, "Last name cannot exceed 30 characters"]
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
    }
})