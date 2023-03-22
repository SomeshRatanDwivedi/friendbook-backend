const express=require('express');
const passport = require('passport');
const messageController=require('../../../controllers/api/v1/message_api')
const router=express.Router();

router.post('/create_new_message', passport.authenticate('jwt',{session:false}), messageController.sendMessage)



























module.exports=router