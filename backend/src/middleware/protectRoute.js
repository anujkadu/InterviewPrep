import { requireAuth } from '@clerk/express'
import User from '../models/User.js';

export const protectRoute = [
    requireAuth(),
    async (req,res,next)=>{
        try{
            const clerkId = req.auth().userId;
            if(!clerkId) return res.status(401).json({msg:"Unauthorized"});
            //find user in db by clearkId
            const user = await User.findOne({clerkId})
            if(!user) return res.status(404).json({msg:"User not found"});
            // attach user to request object
            req.user = user

            next()
        } catch(err){
            console.error("Error in protectRoute middleware:",err);
            res.status(500).json({msg:"Internal server error"});
        }
    }
]