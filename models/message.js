import mongoose from "mongoose";

const messageSchema =new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }, 

    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    message:{
        type:String,
        required:true
    },
    group:{
      type:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group",
      }
    },
    file:{
        type:String
    }
    
},{timestamps:true})

const Message = mongoose.model("Message", messageSchema)
export default Message;