

import express from "express";
import {ENV} from "./lib/env.js"; //configure dotenv
const app = express()     //initialise app

app.get("/",(req,res)=>{
    res.status(200).json({msg:"API working"})
})

app.listen(ENV.PORT,()=> console.log("Server running on port:",ENV.PORT))
