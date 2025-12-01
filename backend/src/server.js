

import express from "express";
import path from "path";
import {ENV} from "./lib/env.js"; //configure dotenv
const app = express()     //initialise app

const __dirname = path.resolve(); //to get current directory path

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

app.listen(ENV.PORT,()=> console.log("Server running on port:",ENV.PORT))
