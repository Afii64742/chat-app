import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../utils/fileUploader.js";
import Message from "../models/message.js";
const router = express.Router();

// send private message 
router.post("/message", authMiddleware, upload.single('file'), async(req, res) => {
    try{
        const {receiverId, message} = req.body;
        const file = req.file ? req.file.path : null;
        const newMessage = new Message({sender: req.user._id, receiver: receiverId, message, file});
        await newMessage.save();
        res.status(201).json({message: "Message sent successfully"})
        
    }catch(err){
    console.log(err)
    res.status(500).json({message: "Something went wrong"})
    }   
})

// get chat history bw two users
router.get("/history/:receiverId", authMiddleware, async(req, res) => {
   try{
    const {receiverId} = req.params;
    const messages = await Message.find({$or:[{sender: req.user._id, receiver: receiverId}, {sender: receiverId, receiver: req.user._id}]});
    res.status(200).json(messages)
   }catch(err){
    console.log(err)
    res.status(500).json({message: "Something went wrong"})
   }

})

// send message in group 

router.post("/group/message", authMiddleware, upload.single('file'), async(req, res) => {
    try{
        const {groupId, message} = req.body;
        const file = req.file ? req.file.path : null;
        const newMessage = new Message({sender: req.user._id, group: groupId, message, file});
        await newMessage.save();
        res.status(201).json({message: "Message sent successfully"})
    }catch(err){
    console.log(err)
    res.status(500).json({message: "Something went wrong"})
    }
})

export default router