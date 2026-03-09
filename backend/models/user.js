import e from "express";
import mongoose from "mongoose";


const schema = new mongoose.Schema({
 name:{
    type: String,
    required: true,
 },
 email:{
    type: String,
    required: true,
    unique: true,
 },
 password:{
    type: String,
    required: true,
 }, 
  role:{
    type: String,
    // enum: ["user", "admin"], 
    //  message: "Role must be either user or admin"
    default: "user",    
  },  
  contact:{
  type: String,
  required: true,
  },
},
{ timestamps: true }
);

export const User = mongoose.model("User", schema);