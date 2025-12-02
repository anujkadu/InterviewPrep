import Session from "../models/Session.js";
import {streamClient, chatClient} from "../lib/stream.js";

//we can also use async handler utility to avoid try catch blocks
//import { asyncHandler } from "../utils/asyncHandler.js";
//example
//export const createSession = asyncHandler(async (req, res) => { ... });
export async function createSession(req,res){
    try{
        const {problem,difficulty} = req.body
        const userId = req.user._id
        const clerkId = req.user.clerkId

        if(!problem || !difficulty){
            return res.status(400).json({message:"Problem and difficulty are required"});
        }

        //generate a unique callId for video call session
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(6)}`

        //create session in db
        const session = await Session.create({problem,difficulty,host:userId,callId});

        //create a stream video call
        await streamClient.video.call("default",callId).getOrCreate({
            data:{
                created_by_id:clerkId,
                custom:{problem,difficulty,sessionId:session._id.toString()}
            }
        });

        //chat messaging

        chatClient.channel("messaging",callId,{
            name : `${problem} Session`,
            created_by_id : clerkId,
            members : [clerkId]
        })

        await channel.create();
        res.status(201).json({message:"Session created successfully",session});
        //We can later send email regarding session details to host
    
    }catch(err){
        console.log("Error in createSession controller:",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}





export async function getActiveSessions(_,res){
     try{
        const sessions = await Session.find({status:"active"})
        .populate("host","name profileImage email clerkId")
        .sort({createdAt:-1})
        .limit(20);
        
        res.status(200).json({sessions});
    }catch(err){
        console.log("Error in getActiveSessions controller:",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}


export async function getMyRecentSessions(req,res){
    try{
    const userId = req.user._id;
   //get sessions where user is host or participant
    await Session.find({
        status:"completed",
        $or:[{host:userId},{participant:userId}]  //mongoose way of typing OR condition
    }).sort({createdAt:-1}).limit(20);
    res.status(200).json({sessions});
}catch(err){
    console.log("Error in getMyRecentSessions controller:",err.message);
    res.status(500).json({message:"Internal server error"});
}
}


export async function getSessionById(req,res){
    try{
        const {id} = req.params

        const session = await Session.findById(id)
        .populate("host","name profileImage email clerkId")
        .populate("participant","name profileImage email clerkId")

        if(!session) return res.status(404).json({message:"Session not found"});


        res.status(200).json({session});
    }catch(err){
        console.log("Error in getSessionById controller:",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}


export async function joinSession(req,res){
    try{
        const {id} = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findBy(id);
        if(!session) return res.status(404).json({message:"Session not found"});

        if(session.participant) return res.status(400).json({message:"Session is already full"});
        session.participant = userId;
        await session.save();

       const channel = chatClient.channel("messaging",session.callId);
       await channel.addMembers([clerkId]);
       res.status(200).json({message:"Joined session successfully",session}); 

    }catch(err){
        console.log("Error in joinSession controller:",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}


export async function endSession(req,res){
    try{
        const {id} = req.params;
        const userId = req.user._id;
        
        const session = await Session.findById(id);

        if(!session) return res.status(404).json({message:"Session not found"});

        //check if user is host
        if(session.host.toString()!==userId.toString()){
            return res.status(403).json({message:"Only host can end the session"});
        }
        //if session is already ended
        if(session.status==="completed"){
            return res.status(400).json({message:"Session is already ended"});
        }
        session.status = "completed";
        await session.save();

        //delete video call
        const call =streamClient.video.call("default",session.callId)
        await call.delete({hard:true});
        //delete chat channel
        const channel = chatClient.channel("messaging",session.callId);
        await channel.delete({hard:true});

        res.status(200).json({message:"Session ended successfully",session});
    }catch{
        console.log("Error in endSession controller:",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}