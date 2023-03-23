const express=require('express');

const postController=require('../../../controllers/api/v1/posts_api');

const passport=require('passport')

const router=express.Router();


router.post('/create', passport.authenticate('jwt', { session: false }), postController.create);

router.delete('/delete_post', passport.authenticate('jwt', {session:false}), postController.deletePost);

router.get('/', passport.authenticate('jwt', { session: false }), postController.getPosts);


























module.exports=router;