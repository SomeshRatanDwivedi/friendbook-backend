const mongoose=require('mongoose');
const notificationSchema=mongoose.Schema({
    sender:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User',
       required:true
    },
    reciever:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content:{
        type:String,
        required:true
    },
    isShown:{
         type:Boolean,
         default:false
    }

},
{
    timestamps:true
});



const Notification=mongoose.model('Notification', notificationSchema);

module.exports=Notification;