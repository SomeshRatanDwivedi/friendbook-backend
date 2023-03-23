const upload = require('../../../config/multer');
const Post = require('../../../models/post');
const path = require('path');
const multer = require('multer');
const aws = require('../../../config/aws');
const env = require('../../../config/environment')



module.exports.create = async (req, res) => {

    try {

        upload(req, res, async (err) => {
            if (!req.body.content) {
                return res.status(400).send({
                    message: "Please write something in post",
                    success: false
                })
            }
            if (err instanceof multer.MulterError) {
                console.log('multer error in post', err)
            } else if (err) {
                console.log("error in creating post", err)
            }

            let postToCreate = {
                content: req.body.content,
                user: req.user._id,
            }


            if (req.file) {
                const keyName = await aws.awsUpload(req.file);
                var params = { Bucket: env.AWS_BUCKET_NAME, Key: keyName };
                const url =  aws.s3.getSignedUrl('getObject', params);
                postToCreate.img = `https://friendbook-files.s3.ap-south-1.amazonaws.com/${keyName}`;
            }
            const newPost = await Post.create(postToCreate);
            const newlyCreatedPost = await Post.findById(newPost._id)
                .populate('user', ['-friends', '-password'])
                .populate({
                    path: 'comments',
                    populate: ({
                        path: 'user'
                    }),
                    populate: ({
                        path: 'likes'
                    })
                })
                .populate('likes');

            return res.status(200).send({
                message: "Post is created",
                data: {
                    post: {
                        ...newlyCreatedPost._doc,
                        no_of_likes: 0,
                        isUserLike: false
                    }
                },
                success: true
            })

        })



    } catch (error) {
        console.log("error in creating post", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }
}


module.exports.getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        let posts = await Post.find({})
            .sort({ 'createdAt': -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate({
                path: 'user',
            })
            .populate({
                path: 'comments',
                options: { sort: { 'createdAt': -1 } },
                populate: ({
                    path: 'user',
                    select: '_id, name'
                }),
            })
            .populate('likes');

        posts = posts.map(post => {
            const userIdInLike = post.likes.filter((like) => {
                return like.user.toJSON() == req.user._id.toJSON()
            })
            const newPost = {
                ...post._doc,
                no_of_likes: post.likes.length,
                isUserLike: userIdInLike.length > 0 ? true : false
            }
            return newPost;
        })
        const count = await Post.countDocuments();
        const totalPages = Math.ceil(count / limit);
        return res.status(200).send({
            message: "All posts",
            data: {
                next: {
                    page: page + 1,
                    limit: limit,
                    totalPages: totalPages

                },
                posts: posts
            },
            success: true
        })

    } catch (error) {
        console.log("error in getting post", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }
}


module.exports.deletePost=async(req, res)=>{
    const {post_id}=req.query;

    try{
        await Post.findByIdAndDelete(post_id);

        return res.status(200).send({
            message:`post of id ${post_id} is deleted`,
            success:true
        })

    }catch(error){
       console.log("err in deleting post", error);
       return res.status(500).send({
        message:'Internal server error',
        success:false
       })
    }

}