import { Schema } from "mongoose";
import mongoose from "mongoose";


const bookSchema = mongoose.Schema(
    {
        bookName:{
            type:String,
            required:true
        },
        bookCategory:{
            type:String,
            required:true
        },
        bookAuther:{
            type:String,
            required:true
        },
        noOfCopies:{
            type:Number,
            required:true
        },
        bookPrice:{
            type:Number,
            required:true
        },
        availability:{
            type:Number,
        },
        
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Book", bookSchema);
