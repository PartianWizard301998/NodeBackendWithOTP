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

//Column based Serch
// export const searchBook = async (req, res, next) =>{

//     try {
//         const {bookName, bookCategory, bookAuther} = req.query;
//         console.log(req.query);

//         // Build the query object based on available filters
//         let query = {};

//         if (bookName) {
//         query.bookName = { $regex: bookName, $options: 'i' };  // Case-insensitive search
//         }

//         if (bookAuther) {
//         query.bookAuther = { $regex: bookAuther, $options: 'i' };
//         }
        
//         if (bookCategory) {
//         query.bookCategory = bookCategory;
//         }

//         const books = await Book.find(query);
//         if(books){
//             return next(CreateSuccess(200, "Books...", books));
//         }else{
//             return next(CreateError(404, "Book Not available with Given search"));
//         }
       
        
//     } catch (error) {
//         return next(CreateError(500, "Internal Server Error"));
//     }
// }

export const searchBook = async (req, res, next) =>{

    try {
        const {query} = req.query;
        //console.log(req.query);
        // Check if the query parameter exists, otherwise return all books
        if (!query) {
            const books = await Book.find();
            return next (CreateSuccess(200, "Books", books));
        }

        const books = await Book.find({
            $or: [
                {bookName : { $regex: query, $options: 'i'}},
                {bookCategory : { $regex : query, $options: 'i'}},
                {bookAuther: { $regex: query, $options: 'i'}}
            ]
        });

        if(books && books.length > 0){
            return next (CreateSuccess(200, "Books", books));
        }else{
            return next (CreateError(400, "Books not found"));
        }
    
    } catch (error) {
        console.log(error);
        return next(CreateError(500, "Internal Server Error"));
    }
}