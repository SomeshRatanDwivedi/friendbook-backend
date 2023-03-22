const express=require('express');
const passport = require('passport');
const router=express.Router();
const conversationController=require('../../../controllers/api/v1/conversation_api')

router.post('/new_conversation', passport.authenticate('jwt', {session:false}), conversationController.makeNewConvarsation);
router.get('/all_conversations', passport.authenticate('jwt', { session: false }), conversationController.getAllConversations);
router.get('/all_messages', conversationController.getAllMessages);
router.get('/participants', conversationController.getParticipants);






















module.exports=router;