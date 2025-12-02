export async function getStreamToken(req,res){
    try{
        //using clerkId to create stream token not mongodb id , it matches the id we have in stream dashboard
        const token = chatClient.createToken(req.user.clerkId)

        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName : req.user.name,
            userImage : req.user.image
        })
    } catch(err){
        console.log("Error generating stream token:",err);
        res.status(500).json({msg:"Internal server error"});
    }
}