const express=require('express');
const passport = require('passport');
const usersController=require('../../../controllers/api/v1/users_api')
const router=express.Router();



router.post('/signup', usersController.signup);
router.post('/login', usersController.login);
router.post('/edit', passport.authenticate('jwt', {session:false}), usersController.editProfile);
router.get('/search', passport.authenticate('jwt', {session:false}), usersController.searchUser);
router.get('/get_all_users', passport.authenticate('jwt', { session: false }), usersController.getAllUsers);
router.get('/:id', passport.authenticate('jwt', { session: false }), usersController.userInfo);






























module.exports=router;