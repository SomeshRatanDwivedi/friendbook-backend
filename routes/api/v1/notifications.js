const express=require('express');
const passport = require('passport');

const notificationController=require('../../../controllers/api/v1/notification_api');
const router=express.Router();

router.post('/create_notification', passport.authenticate('jwt', {session:false}), notificationController.create);
router.get('/get_notifications', passport.authenticate('jwt', { session: false }), notificationController.getNotification);
router.get('/no_of_notifications', passport.authenticate('jwt', { session: false }), notificationController.getNumberOfNewNotifications)



















module.exports=router;