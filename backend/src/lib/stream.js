import {StreamChat} from "stream-chat"
import {ENV} from "./env.js"
import {StreamClient} from "@stream-io/node-sdk";
const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.STREAM_API_SECRET


if(!apiKey || !apiSecret){
    console.error("Stream_API_KEY or secret is missing")
}



export const chatClient = StreamChat.getInstance(apiKey,apiSecret); //this is for chat features
export const streamClient = new StreamClient(apiKey,apiSecret); //this is for video calls

export const upsertStreamUser = async(userData)=>{                  //upsert means to create or update
    try{
        await chatClient.upsertUser(userData)
        console.log("Upserted user successfully to stream:",userData);
    }catch(err){
        console.error("Error upserting stream user:",err)
    }
}



export const deleteStreamUser = async(userId)=>{                 
    try{
        await chatClient.deleteUser(userId)
        console.log("Deleted user successfully from stream:",userId);
    }catch(err){
        console.error("Error deleting stream user:",err);
    }
}

