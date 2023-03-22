const Conversation = require("../../../models/converstaion");
const User = require("../../../models/user");

module.exports.makeNewConvarsation=async(req, res)=>{
    const {recieverId}=req.query;
    const senderId=req.user._id;
    try{
        const newConversation=await Conversation.create({
            participants:[senderId, recieverId]
        });

        const sender=await User.findById(senderId);
        sender.conversations.push(newConversation._id);
        sender.save();

        const reciever=await User.findById(recieverId);
        reciever.conversations.push(newConversation._id);
        reciever.save();

        const newConversationWithPopulatedParticipants=await Conversation.findById(newConversation._id).populate('participants')

        return res.status(200).send({
            message:'New conversation is created',
            data:{
              conversation:newConversationWithPopulatedParticipants
            },
            success:true
        })

    }catch(error){
        console.log("error in making conversation", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }

}




module.exports.getAllConversations=async(req, res)=>{
    try{
        const userId=req.user._id;
        const userInfo=await User.findById(userId).populate({
            path:'conversations',
            populate:({
                path:'participants'
            })

        })
        res.status(200).send({
             message:"Here are all conversations of user",
             data:{
                 conversations: userInfo.conversations,
             },
             success:true

        })
        

    }catch(error){
        console.log("error in getting conversation", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }
}


module.exports.getAllMessages=async(req, res)=>{
    try{
        const {conversationId}=req.query;
        const conversation=await Conversation.findById(conversationId).populate('messages');
        return res.status(200).send({
            success:true,
            data:{
                messages:conversation.messages
            },
            message:`Here are all the messages of conversation id ${conversationId}`
        })

    }catch(error){
        console.log("error in getting messages", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }
}

module.exports.getParticipants = async (req, res) => {
    try {
        const { conversationId } = req.query;
        const conversation = await Conversation.findById(conversationId).populate('participants');
        return res.status(200).send({
            success: true,
            data: {
                participants:conversation.participants
            },
            message: `Here are all the participants of conversation id ${conversationId}`
        })

    } catch (error) {
        console.log("error in getting participants", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }
}