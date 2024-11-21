import mongoose from "mongoose";

const groupSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    members: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    groupDp:{
        type:String
    }
})

const Group = mongoose.model("Group", groupSchema)
export default Group;