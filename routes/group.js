import express from "express";
import upload from "../utils/fileUploader.js";
import Group from "../models/group.js";
const router  = express.Router();

router.post("/create", upload("groupDp"), async(req, res) => {
   try{
    const {members, name} = req.body
   const groupDp = req.file ? req.file.path : null;
   const newGroup = new Group({members, name, groupDp})
   await newGroup.save();
   res.status(201).json({message: "Group created successfully"})
   }catch(err){
       console.log(err)
       res.status(500).json({message: "Something went wrong"})
   }
})