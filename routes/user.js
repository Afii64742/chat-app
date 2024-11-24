import express from "express";
import User from "../models/user.js"
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        // Assuming req.user contains the logged-in user's id
        const loggedInUserId = req.user._id; // Replace `id` with the correct property

        // Exclude the logged-in user from the results
        const users = await User.find({ _id: { $ne: loggedInUserId } });

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

//me

router.get("/me", authMiddleware , async(req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({message: "Something went wrong"})
    }
})

export default router