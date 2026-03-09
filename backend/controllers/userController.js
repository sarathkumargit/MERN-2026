import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";
import crypto from "crypto";    



//new user registration
export const registerUser= async (req, res) =>  {
    try{
        const {name,email,password,contact} = req.body;
        //code to check the email already exists in the database
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }
        // password encryption
        const hashedPassword = await bcrypt.hash(password, 10);

        //generate otp for fixed 6 digits
        //const otp = Math.floor(100000 + Math.random() * 900000);
        const otp=crypto.randomInt(100000, 1000000); 
        

        //create new user 
        user = {name,email,hashedPassword,contact};
        
        //activation token
        const activationToken = jwt.sign({user,otp}, process.env.ACTIVATION_KEY, {expiresIn: "60m"});
        //send mail
        const message = `please verify your email using this otp: ${otp}`;
        await sendMail(email, "welcome ", message);

        return res.status(200).json({message: "Registration successful, please check your email for OTP", activationToken});

    }catch(error){
        return res.status(500).json({message: error.message});
    }
}       

//verify otp
export const verifyUser=async (req, res) => {
    try{
        const {activationToken, otp} = req.body;
        const verify= jwt.verify(activationToken, process.env.ACTIVATION_KEY);
        if(!verify){
            return res.status(400).json({message: "otp expired, please register again"});
        }
        if(verify.otp !== otp){
            return res.status(400).json({message: "Invalid OTP"});
        }

        await User.create({
            name:verify.user.name,
            email:verify.user.email,
            password:verify.user.hashedPassword,
            contact:verify.user.contact
        });
        return res.status(200).json({message: "User registration successfully"});
       
       
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}   