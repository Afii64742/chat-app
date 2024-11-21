import express from "express";
import bcrypt from "bcrypt"
import User from "../models/user.js"
const router = express.Router();

router.post("/", async(req, res) => {
    try{
        const {firstName, lastName, username, email, password} = req.body;
    const newUser = new User({firstName, lastName, username, email, password})
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
        res.status(200).json({message: "Login successful"})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Something went wrong"})
    }
})

export default router