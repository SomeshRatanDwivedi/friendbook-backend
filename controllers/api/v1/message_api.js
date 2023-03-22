const Conversation = require("../../../models/converstaion");
const Message = require("../../../models/message");

module.exports.sendMessage=async(req, res)=>{
    try{
        
        const { recieverId, conversationId } = req.query;
        console.log(recieverId, conversationId, req.body)
        const senderId = req.user._id;
        const newMessage = await Message.create({
            reciever: recieverId,
            sender: senderId,
            content: req.body.content
        });
        
        const conversation=await Conversation.findById(conversationId);
        conversation.messages.push(newMessage._id);
        conversation.save();
        return res.status(200).send({
            message:"Here is new message",
            data:{
                message:newMessage
            },
            success:true
        })

    }catch(error){
        console.log("err in send message", error);
        return res.status(500).send({
            message: 'Internal server error',
            success:false
        })
    }

}