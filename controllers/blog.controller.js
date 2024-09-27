 import Blog from '../models/Blog.js';
 import { CreateSuccess } from '../utils/success.js';
 import { CreateError } from '../utils/error.js';

export const getAllBlogs = async(req, res, next) =>{
    try {
        const blogs = await Blog.find();
       if (blogs) {
        //return res.send({"status" : true, "message" : "Blogs fetched Successfully", "status-code" : 200, blogs});
        return next(CreateSuccess(200, "Blogs fetched Successfully.", blogs));
       } else {
        return res.send({"status" : false, "message" : "Blogs not Available.", "status-code" : 404});
       }
    } catch (error) {
        return res.send({"status" : false, "message" : "Internal Server Error", "status-code" : 500});
    }
}

export const getBlogById = async(req, res, next) =>{
    
    try {
        const blogs = await Blog.findById({_id: req.params.id});
        // console.log("byID");
        if (blogs) {
            return next(CreateSuccess(200, 'Blog Fetched Successfully', blogs));
           } else {
            return next(CreateError(404, 'Blog not found.'));
           }
    } catch (error) {
            console.log(error);
            return next(CreateError(500, 'Internal Server..'));
    }

}

export const getBlogByUsername = async(req, res, next) =>{
    
    try {
        const blogs = await Blog.find({userName : req.params.userName});
        // console.log(blogs);
        if (blogs) {
            return next(CreateSuccess(200, 'Blog Fetched Successfully', blogs));
           } else {
            return next(CreateError(404, 'Blog not found.'));
           }
    } catch (error) {
            console.log(error);
            return next(CreateError(500, 'Internal Server Error.'));
    }

}

// export const createBlog = async(req, res, next) =>{

//     try {
//         const userName = await Blog.find({userName : req.body.userName});
//         const newBlog = new Blog({
//             blogTitle : req.body.blogTitle,
//             blogContent : req.body.blogContent,
//             blogCatagory : req.body.blogCatagory
//         });
//          await newBlog.save();
//         return next(CreateSuccess(200, 'Blog Added'));
        
//     } catch (error) {
//         console.log(error);
//         return next (CreateError(500, 'Something went wrong'));
//     }
// }

export const deleteBlog = async(req, res, next) =>{
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById({_id: blogId});
        if (blog) {
            await Blog.findByIdAndDelete(blogId);
           //return res.send({"status" : true, "message" : "Blog Deleted Successfully", "status-code" : 200});
            return next(CreateSuccess(200, 'Blog Deleted Successfully'))
        } else {
            //return res.send({"status" : false, "message" : "Role not Found.", "status-code" : 400});
            return next(CreateError(400, 'Blog not Found.'))
        }
    } catch (error) {
        //return res.send({"status" : false, "message" : "Interanl Server Error", "status-code" : 500});
        return next (CreateError(500, 'Something went Wrong'));
    }
}

export const updateBlog = async(req, res, next) =>{
    try {
        const blog = await Blog.findById({_id : req.params.id});
        if (blog) {
            const newData = await Blog.findByIdAndUpdate(
                req.params.id,
                {$set : req.body},
                {new : true}
            );
            await newData.save();
            return next(CreateSuccess(200, "Blog updated."));
            //return res.send({"status" : true, "message" : "Role Updated Successfully", "status-code" : 200});
        } else {
            return next(CreateError(400, "Bad Request"));
            //return res.send({"status" : false, "message" : "Bad Request", "status-code" : 400});
        }
    } catch (error) {
        return  next(CreateError(500, "Interanl Server Error......."));
        //return res.send({"status" : false, "message" : "Interanl Server Error", "status-code" : 500});
    }
}

export const createBlog = async(req, res, next) =>{ 

    try {
        const userName = await Blog.find({userName : req.body.userName});
        if (userName) {
            const newBlog = new Blog({
                blogTitle : req.body.blogTitle,
                blogContent : req.body.blogContent,
                blogShortDesc : req.body.blogShortDesc,
                blogCatagory : req.body.blogCatagory,
                userName : req.body.userName
            });
             await newBlog.save();
            return next(CreateSuccess(200, 'Blog Added'));
        }
        
    } catch (error) {
        console.log(error);
        return next(CreateError(500, 'Something went wrong'));
    }
}


