import mongoose from 'mongoose';
import User from '../models/User.js'
import { Schema } from "mongoose";

const blogSchema = mongoose.Schema(
    {
        blogTitle:{
            type: String,
            required : true,
            unique:true
        },
        blogCatagory:{
            type: String,
            required : true
        },
        blogShortDesc:{
            type: String,
            required : true
        },
        blogContent:{
            type: String,
            required : true
        },
        userName:{
            type: String,
            required: true
        },

        // email:{
        //     type: [Schema.Types.ObjectId],
        //     required:true,
        //     ref: User
        // },
        // userNames:{
        //     type: [Schema.Types.ObjectId],
        //     required:true,
        //     ref: User
        // }
    },
        {
            timestamps: true
        }
);

export default mongoose.model("Blog", blogSchema);