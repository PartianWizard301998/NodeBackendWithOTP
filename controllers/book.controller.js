import Book from "../models/Book.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const addBook = async (req, res, next) =>{
    try{
        //const bookName = await Book.find({bookName : req.body.bookName});
        const newBook = new Book({
            bookName : req.body.bookName,
            bookCategory : req.body.bookCategory,
            bookAuther :req.body.bookAuther,
            noOfCopies : req.body.noOfCopies,
            bookPrice : req.body.bookPrice,
            availability : req.body.availability
        });
        await newBook.save();
        return next(CreateSuccess(200, "Book added Successfully"));
    }catch (error){
        return next(CreateError(500,"Something went wrong"));
    }
}

export const getAllBooks = async (req, res, next) =>{
    try {
        const books = await Book.find();
        if(books){
            return next(CreateSuccess(200, "Books fetched Successfully.", books));
        }else{
            //return res.send({"status" : false, "message" : "Books not Available.", "status-code" : 404});
            return next(CreateError(404, "Books not Available."));
        }
    } catch (error) {
        //return res.send({"status" : false, "message" : "Internal Server Error", "status-code" : 500});
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const deleteBook = async (req, res, next) =>{
    try {
        const bookId = req.params.id
        const book = await Book.findById({_id: bookId});
        if (book) {
            await Book.findByIdAndDelete(bookId);
           //return res.send({"status" : true, "message" : "Blog Deleted Successfully", "status-code" : 200});
            return next(CreateSuccess(200, 'Book Deleted Successfully'))
        } else {
            //return res.send({"status" : false, "message" : "Role not Found.", "status-code" : 400});
            return next(CreateError(400, 'Book not Found.'))
        }
        
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
        
    }
}
