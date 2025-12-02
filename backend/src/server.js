

import express from "express";
import path from "path";
import cors from "cors";
import {ENV} from "./lib/env.js"; //configure dotenv
import {serve} from "inngest/express";
import {inngest,functions} from "./lib/inngest.js";
const app = express()     //initialise app

const __dirname = path.resolve(); //to get current directory path


app.use(express.json())  //middleware to parse json body
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))

app.use("/api/inngest",serve({client:inngest, functions}))

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"API working"})
})



//make our app ready for deployment
if(ENV.NODE_ENV === "development"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}


const startServer = async()=>{
    try{
        await connectDB();
        app.listen(ENV.PORT,()=> {
        console.log("Server running on port:",ENV.PORT)

    });
    } 
    catch(err){
        console.log("Error starting server:",err)
    }
};

startServer();



//app.listen(ENV.PORT,()=> console.log("Server running on port:",ENV.PORT))
