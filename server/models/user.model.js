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
})
const User = model("User", UserSchema);
export default User;