const Notification = require("../../../models/notifications");
const User = require("../../../models/user");

module.exports.create = async (req, res) => {
    const loginUserId = req.user._id;
    const { notification_type, userId } = req.query;
    if(loginUserId == userId){
        return res.status(200).send({
            message: "New notification created",
            success: true
        })
    };
    const userInfo = await User.findById(loginUserId);
    let notificationContent = '';

    if (notification_type == 'Like') {
        notificationContent = `liked your post`;
    }
    else if (notification_type == 'Comment') {
        notificationContent = `commented on your post`
    }

    
    try {

        const newNotification = await Notification.create(
            {
                reciever: userId,
                sender:loginUserId,
                content: notificationContent
            }
        )

        return res.status(200).send({
            message:"New notification created",
            data:{
                notification:newNotification
            },
            success:true
        })

    } catch (error) {
        console.log("err in making notifications", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }

}


module.exports.getNotification=async(req, res)=>{
    const loginUserId=req.user._id
    try{
        const notifications=await Notification.find({reciever:loginUserId})
                                              .sort({'createdAt':-1})
                                              .populate('sender')
                                              .populate('reciever');

        res.status(200).send({
             message:'Your all notifications',
             data:{
                notifications:notifications
             },
             success:true
        })
        const updatedNotification = await Notification.updateMany({ isShown: false }, { isShown: true }, { upsert: true });

    }catch(error){
        console.log("error in getting notifications", error);
        return res.status(500).send({
            message:"Internal server error",
            success:false
        })
    }
}

module.exports.getNumberOfNewNotifications=async(req, res)=>{
    const loginUserId = req.user._id
    try {
        const notifications = await Notification.find({ reciever: loginUserId, isShown:false })
        return res.status(200).send({
            message: 'Your all notifications',
            data: {
                no_of_notifications: notifications.length
            },
            success: true
        })

    } catch (error) {
        console.log("error in getting notifications", error);
        return res.status(500).send({
            message: "Internal server error",
            success: false
        })
    }
}
