import express from "express";
import User from "../models/user.js"
import Message from "../models/message.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        // Get all users excluding the current user
        const users = await User.find({ _id: { $ne: req.user._id } });

        // Fetch the last message for each user
        const usersWithLastMessages = await Promise.all(
            users.map(async (user) => {
                const lastMessage = await Message.findOne({
                    $or: [
                        { sender: req.user._id, receiver: user._id },
                        { sender: user._id, receiver: req.user._id }
                    ]
                })
                .sort({ createdAt: -1 }) // Sort by most recent
                .exec();

                return {
                    ...user.toObject(),
                    lastMessage: lastMessage
                        ? {
                            content: lastMessage.message,
                            sender: lastMessage.sender,
                            createdAt: lastMessage.createdAt,
                        }
                        : null, // No messages yet
                };
            })
        );

        res.status(200).json(usersWithLastMessages);
    } catch (err) {
        console.log(err);
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