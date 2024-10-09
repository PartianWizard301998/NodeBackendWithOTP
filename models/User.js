import { Schema } from "mongoose";
import mongoose from 'mongoose';
import Role from "../models/Role.js";
import Book from "../models/Book.js";
const userSchema = mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        userName:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        profileImage:{
            type:String,
            required:false,
            default:"https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
        },
        isAdmin:{
            type : Boolean,
            default:false
        },
        otp:{
            type : String,
            required: false
        },
        isVerified: { 
            type: Boolean, 
            default: false 
        },        
        roles:{
            type: [mongoose.Schema.Types.ObjectId],
            required:true,
            ref: Role
        },
        issuedBooks:{
            type: [mongoose.Schema.Types.ObjectId],
            ref : 'Book'
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);