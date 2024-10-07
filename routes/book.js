import express from 'express';
import { verifyAdmin } from '../utils/verifyJwtToken.js';
import { addBook, deleteBook, getAllBooks, searchBook } from '../controllers/book.controller.js';
const router = express.Router();

router.post('/addBook',  addBook);

// router.get('/getAllbooks', getAllBooks);

router.delete('/deleteBook/:id', deleteBook);

router.get('/search', searchBook);

export default router;