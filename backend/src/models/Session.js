import mongoose from "mongoose";

const sessionScehma = new mongoose.Schema({
    problem:{
        type:String,
        requireed:true
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        required:true
    },
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    participant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default : null

    },
    status :{
        type : String,
        enum: ["active","completed"],
        default : "active"
    },
    //stream Video call id
    callId :{
        type : String,
        default : null
    }
},{timestamps:true}
);

const Session = mongoose.model("Session",sessionScehma);

export default Session;