import express from 'express';
import { verifyUser } from '../utils/verifyJwtToken.js';
import { createBlog, getAllBlogs, deleteBlog, updateBlog, getBlogById, getBlogByUsername } from '../controllers/blog.controller.js';
const router = express.Router();

router.get('/', getAllBlogs);

router.get('/:id', getBlogById);

router.get('/myBlogs/:userName', getBlogByUsername);

router.post('/createBlog', createBlog);

router.delete('/deleteBlog/:id', deleteBlog);

router.patch('/updateBlog/:id', updateBlog);

export default router;


