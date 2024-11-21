import express from "express";
import User from "../models/user.js"
const router = express.Router();

router.get("/", async(req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Something went wrong"})
    }
    
})

export default router