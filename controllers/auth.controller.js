import Role from '../models/Role.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import userToken from '../models/userToken.js';
import Book from '../models/Book.js';
import { json } from 'express';

//Registration Controller
export const registerUser = async (req, res, next) =>{

    try {
        const user = await User.findOne({email : req.body.email});
        if(user){
            return next(CreateError(409, "Email Already Exist"));
            //return res.send({"status" : false, "message" : "Email Already Exist", "status-code" : 409});
        }else{
            const user = await User.findOne({userName : req.body.userName});
            if(user){
                return next(CreateError(409, "UserName Already Exist"));
                //return res.send({"status" : false, "message" : "UserName Already Exist", "status-code" : 409});
            }else{
                //by default while registering the role must be USER if he or she needs admin access will they needs to send the email.
                //Hence we are first we are checking for the 'User' role in DB and assigning it to the role constant.
                const role = await Role.find({role : 'User'});
                /*The below line will create a salt(key) for our password then we will hash our password as we cant store the hard codes
                password in Databases.*/
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(req.body.password, salt);

                const otp = generateOTP();

                const newUser = new User({
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    userName : req.body.userName,
                    email : req.body.email,
                    password: hashPassword,
                    isAdmin : false,
                    roles:role,
                    otp : otp,
                });

                await newUser.save();
                
                const mailOptions = {
                    from: 'vaibsprotfolio1998@gmail.com',
                    to: req.body.email,
                    subject: 'Library Account Verification OTP',
                    html: `
        
                        <html>
                        <head>
                            <title>Library Account Verification OTP</title>
                        </head>
                        <body>
                            <h1>OTP Verification Request</h1>
                            <p>Dear ${req.body.userName},</p>
                            <p>To Process with your account, we request you to please verify the OTP (One Time Password) for login to the application.
                            Tha additional security measure ensures the protection of your account and data.</p>
                            <p>Thank You,</p>

                            <h4>Please find below OTP for your referance</h4>
                            <h2>${otp}</h2>
                    
                        </body>
                        </html>
                        `
                };
        
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Error: ", error.message)
                        return res.send({"status" : false, "message" : "Something went wrong while sendng email.", "status-code" : 500});
                    } else {
                       return res.send({"status" : true, "message" : "The OTP has been sent to your registered email.", "status-code" : 200});

                    }
                });       
                 }

                // return next(CreateSuccess(200, "User Registered Successfully."));
                // //return res.send({"status" : true, "message" : "Admin Registered Successfully.", "status-code" : 200});
         }
        
    } catch (error) {
        console.log(error);
        return next(CreateError(500, "Something went Wrong", error.message));
        //return res.send({"status" : false, "message" : "Something went Wrong", "status-code" : 500});
    }
}

//Admin Registration Controller
export const registerAdmin = async (req, res, next) =>{

    try {
        const user = await User.findOne({email : req.body.email});

        if(user){
            return next(CreateError(409, "Email Already Exist"));
            //return res.send({"status" : false, "message" : "Email Already Exist", "status-code" : 409});
        }else{
            const user = await User.findOne({userName : req.body.userName});
            if(user){
                return next(CreateError(409, "UserName Already Exist"));
                //return res.send({"status" : false, "message" : "UserName Already Exist", "status-code" : 409});
            }else{
                //by default while registering the role must be USER if he or she needs admin access will they needs to send the email.
                //Hence we are first we are checking for the 'User' role in DB and assigning it to the role constant.
                const role = await Role.find({});
                /*The below line will create a salt(key) for our password then we will hash our password as we cant store the hard codes
                password in Databases.*/
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(req.body.password, salt);

                const otp = generateOTP();

                const newUser = new User({
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    userName : req.body.userName,
                    email : req.body.email,
                    password: hashPassword,
                    isAdmin : true,
                    roles:role,
                    otp : otp,
                });
                await newUser.save();

                const mailOptions = {
                    from: 'vaibsprotfolio1998@gmail.com',
                    to: req.body.email,
                    subject: 'Library Account Verification OTP',
                    html: `
        
                        <html>
                        <head>
                            <title>Library Account Verification OTP</title>
                        </head>
                        <body>
                            <h1>OTP Verification Request</h1>
                            <p>Dear ${req.body.userName},</p>
                            <p>To Process with your account, we request you to please verify the OTP (One Time Password) for login to the application.
                            Tha additional security measure ensures the protection of your account and data.</p>
                            <p>Thank You,</p>

                            <h4>Please find below OTP for your referance</h4>
                            <h2>${otp}</h2>
                    
                        </body>
                        </html>
                        `
                };
        
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Error: ", error.message)
                        return res.send({"status" : false, "message" : "Something went wrong while sendng email.", "status-code" : 500});
                    } else {
                       return res.send({"status" : true, "message" : "The OTP has been sent to your registered email.", "status-code" : 200});

                    }
                });       
                 }

                return next(CreateSuccess(200, "Admin Registered Successfully."));
                //return res.send({"status" : true, "message" : "Admin Registered Successfully.", "status-code" : 200});
         }
        
    } catch (error) {
        return next(CreateError(500, "Something went Wrong"));
        //return res.send({"status" : false, "message" : "Something went Wrong", "status-code" : 500});
    }
}

export const sendEmail = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({email: {$regex: '^'+email+'$', $options:'i'}});

    if(!user){
        //return res.send({"status" : false, "message" : "User Not Found to reset the email", "status-code" : 404});
        return res.send({"status" : false, "message" : "User Not Found to reset the email", "status-code" : 404});
    }

    const payload = {
        email : user.email
    }

    const expiryTime = 300;
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn:expiryTime});

    const newToken = new userToken({
        userId : user._id,
        tolen : token
    });


    const mailTransporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : "vaibsprotfolio1998@gmail.com",
            pass : "ubqp pkry pqde tihz"
        }
    });
    let mailDetails ={
        from : "vaibsprotfolio1998@gmail.com",
        to : email,
        subject : "Reset Password!!",
        html : `
        
        <html>
  <head>
    <title>Password Reset Request!!</title>
  </head>
  <body>
    <h1>Password Reset Request</h1>
    <p>Dear ${user.userName},</p>
    <p>We have recieved a request to reset you Password for you account with BookMyBook.
    to complete the Password reset process, please click on the button below :</p>
    <a href=${process.env.LIVE_URL}/reset/${token}><button style="background-color:#4CAF50; color: white; padding:14px 20px; border:none;
      cursor:pointer; border-radius:4px;">Reset Password</button></a>
      <p>Please note that this link is only valid for 5 mins. If you did not request a password reset, please disregard thos message</p>
      <p>Thank You,</p>
      <p>Lets Program Team</p>
  </body>
</html>
        `,

    };

    mailTransporter.sendMail(mailDetails, async(error, data) =>{

        if(error){
            console.log(error);
            return res.send({"status" : false, "message" : "Something went wrong while sendng email.", "status-code" : 500});
        }else{
            await newToken.save();
            return res.send({"status" : true, "message" : "Email sent Successfully.", "status-code" : 200});
        }
    })
}

export const resetPass = async (req, res, next) =>{
    const token = req.body.token;
    const newPassword = req.body.password;

    jwt.verify(token, process.env.JWT_SECRET_KEY, async(err, data)=>{
        if(err){
            return res.send({"status" : false, "message" : "Reset Link is Expired.", "status-code" : 500});
        }else{
            const response = data;
            const user = await User.findOne({email: {$regex: '^'+response.email+'$', $options:'i'}});
            const salt = await bcrypt.genSalt(10);

            const encryptedPassword = await bcrypt.hash(newPassword, salt);
            user.password = encryptedPassword;

            try {
                const updatedUser = await User.findOneAndUpdate(
                    {_id:user._id},
                    {$set: user},
                    {new : true}
                )
                return res.send({"status" : true, "message" : "Password Reset Success.", "status-code" : 200});
            } catch (error) {
                return res.send({"status" : false, "message" : "Something went wrong while reseting your Password.", "status-code" : 500});
            }
        }
    })
}

export const Login = async (req, res, next) =>{ 
    
    try {
        const user = await User.findOne({email: req.body.email}).populate("roles", "role")
        const {roles} = User;

        if(!user){
            return next(CreateError(404, "Email Not Found"));
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect){
            return next(CreateError(400,"Password Missmatch"));
        }

        if (!user.isVerified) return res.status(400).json({ msg: 'Please verify your email' });

        const token = jwt.sign(
            {id:user._id, isAdmin: user.isAdmin, roles:roles},
            process.env.JWT_SECRET_KEY
        )
        console.log(token);
        res.cookie("access_token", token, {httpOnly: true})
        .status(200)
        .json({
            status : 200,
            message : "Login Successfull.",
            data : user,
            access_token : token
        })
        
    } catch (error) {
        console.log(error);
        return next(CreateError(500, "Something went Wrong"));
    }

}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const verifyOTP = async ( req, res, next) =>{
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });

        user.isVerified = true;
        user.otp = null;  // Clear the OTP after verification
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, 'jwtSecret', { expiresIn: 3600 });
        res.json({message:"OTP Verified Successfully, The user has been registerd successfully, You may Process to login your account", token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vaibsprotfolio1998@gmail.com',
        pass: 'ubqp pkry pqde tihz'
    }
});

//Column based search
// export const searchUser = async (req, res, next) =>{

//     try {
//         const {firstName,lastName, userName, email} = req.query;
//         //console.log(email);

//         let query = {};

//         if(firstName){
//             query.firstName = { $regex : firstName, $options: 'i'};
//         }

//         if(lastName){
//             query.lastName = { $regex : lastName, $options: 'i'};
//         }

//         if(userName){
//             query.userName = { $regex : userName, $options: 'i'};
//         }

//         if(email){
//             query.email = { $regex : email, $options: 'i'};
//         }

//         const users = await User.find(query);
//         //console.log(users)

//         if(users && users.length > 0){
//             return next (CreateSuccess(200, "Users", users));
//         //    return res.status(200).json({
//         //     message: "Users found...",
//         //     data: users
//         // });
//         }else{
//             return next (CreateError(400, "Users not found"));
//             // return res.status(404).json({
//             //     message: "User not available with given search criteria"
//             // });
//         }
//     } catch (error) {

//         console.log(error);
//         return next(CreateError(500, "Internal Server Error"));
//         // return res.status(500).json({
//         //     message: "Internal Server Error"
//         // });
        
//     }
  
// }

//String based search
export const searchUser = async (req, res, next) =>{

    try {
        const {query} = req.query;
        //console.log(req.query);
         // Check if the query parameter exists, otherwise return all books
        if (!query) {
            const users = await User.find().populate('issuedBooks');
            return next (CreateSuccess(200, "Users", users));
        }

          // Perform search across multiple fields (title, author, category)
        const users = await User.find({
            $or: [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { userName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
            ]
        });

        if(users && users.length > 0){
            return next (CreateSuccess(200, "Users", users));
        }else{
            return next (CreateError(400, "Users not found"));
        }

    }catch (error) {
        console.log(error);
        return next(CreateError(500, "Internal Server Error")); 
    }
  
}


export const orderBook = async (req, res, next) =>{
    try {

        const {userId, bookId } = req.body;
        
        const user = await User.findById(userId).populate('issuedBooks');
        

        if (user.issuedBooks.length >= 3) {
            return next(CreateError(400, "Cannot issue more than 3 Books"));
        } 

        // const book = {
        //     bookId,
        //     issuedDate :  Date
        // }
        console.log(user.issuedBooks);
        user.issuedBooks.push(bookId);
        await user.save();

         // Populate the issuedBooks field again to return full book details
        // const updatedUser = await User.findById(userId).populate('issuedBooks');

        return next(CreateSuccess(200, "Book Issued Successfully",user));

    } catch (error) {
        console.log(error);
        return next(CreateError(500, "Internal Server Error")); 
    }
}