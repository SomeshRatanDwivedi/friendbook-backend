const mongoose=require('mongoose');

const messageSchema=mongoose.Schema({
     content:{
        type:String,
        required:true
     },
     sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
     },
     reciever:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required:true
     }  
},
{
    timestamps:true
})

const Message=mongoose.model('Message', messageSchema);

module.exports=Message