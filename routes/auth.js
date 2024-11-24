import express from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import upload from "../utils/fileUploader.js";
const router = express.Router();

router.post("/register", upload.single("profilePicture"), async(req, res) => {
    try{
        const {firstName, lastName, username, email, password} = req.body;
        const checkUser = await User.findOne({email});
        if(checkUser){
            return res.status(400).json({message: "User already exists"})
        }
        // extracting the relative path for the file
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;
        const newUser = new User({
        firstName,
        lastName,
        username,
        email, password, 
        profilePicture
    })
    await newUser.save();
    res.status(201).json({message: "User created successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Something went wrong"})
    }
})

router.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({message: "Invalid credentials"})
        }
        const token = await jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"});
        res.status(200).json({token})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Something went wrong"})
    }
})

export default router