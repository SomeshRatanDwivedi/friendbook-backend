const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const upload = require('../../../config/multer');
const path=require('path');
const fs=require('fs')


module.exports.signup=async(req, res)=>{
    try{

        if (req.body.password === req.body.confirm_password) {

            const isAlreadyUserExist=await User.findOne({email:req.body.email});
            if(isAlreadyUserExist){
                return res.status(401).send({
                    message: "User is already exist",
                    success: false
                })
            }
            const encryptedPassword=await bcrypt.hash(req.body.password, 10);
            const newUser=await User.create({
                ...req.body,
                password: encryptedPassword
            })
            res.status(200).send({
                message: "Sign up successfull, user created",
                success: true,
            })

        }
        else{
           return res.status(401).send({
            message:"Password and  confirm password does not match",
            success:false
           })

        }

    }catch(error){
        console.log("error in signup", error);
        return res.status(500).send({
            message:'Internal server error',
            success: false
        })
        
    }
     
     
}


module.exports.login=async(req, res)=>{
    console.log("***", req.body.email );

    try{
        const user=await User.findOne({email:req.body.email}).populate('friends');
        if(!user){
            return res.status(401).send({
                message:"User does not exist",
                success:false
            })
        }

        const isPasswordCorrect=await bcrypt.compare(req.body.password, user.password);
        if(isPasswordCorrect){
            return res.status(200).send({
                message:"You are signed in successfully",
                data:{
                    token: jwt.sign(user.toJSON(), 'secret', { expiresIn: '100000000' }),
                    user:user
                },
                success:true
            })
        }
        return res.status(401).send({
            message:"Username/Password is not matching",
            success:false
        })

    }catch (error) {
        console.log("error in signin", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })

    }
    
}

module.exports.userInfo=async(req, res)=>{
    try{
        const userId= req.params.id;
        const user=await User.findById(userId)
                             .populate('friends');
        return res.status(200).send({
            message:'User information',
            data:{
                user:user
            },
            success:true
        })

    }catch (error) {
        console.log("error in getting user info", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })

    }
    

}



module.exports.editProfile=(req, res)=>{
        
          upload(req, res, async(err)=>{
            try{
                const {name, desc, homeTown, city, relationship}=req.body;
                const user=await User.findById(req.user._id).populate('friends');
                user.name=name;
                user.desc = desc;
                user.homeTown = homeTown;
                user.city = city;
                user.relationship = relationship;
                if(req.file){
                    if(user.avtar){
                        const imagePath=path.join(__dirname, '../../../', user.avtar);
                        if(fs.existsSync(imagePath)){
                            fs.unlinkSync(imagePath);
                        }
                    }

                    user.avtar='images/'+req.file.filename;
                }
                user.save();

                return res.status(200).send({
                    success:true,
                    data:{
                        user:user,
                        token: jwt.sign(user.toJSON(), 'secret', { expiresIn: '100000000' }),
                    },
                    message:"Your data is saved"
                })

            }catch(error){
                console.log("error in editing user info", error);
                return res.status(500).send({
                    message: 'Internal server error',
                    success: false
                })
            }
          })
}



module.exports.searchUser=async(req, res)=>{
    try{

        const { text } = req.query;
        if(!text){
            return res.status(200).send({
                message: "Here are the matching user",
                data: {
                    users:[]
                },
                success: true
            })
        }
        const allUsers = await User.find({});
        const searchedUser=allUsers.filter((user)=>{
            return user.name.toUpperCase().includes(text.toUpperCase());
        })
        return res.status(200).send({
            message:"Here are the matching user",
            data:{
                users:searchedUser
            },
            success:true
        })

    }catch(error){
        console.log("error in getting user by search", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }
    


}

module.exports.getAllUsers=async(req, res)=>{
    try{

        const users=await User.find({})
        return res.status(200).send({
            success:true,
            message:"Here are all users",
            data:{
                users:users
            }
        })


    }catch(error){
        console.log("error in getting all users", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }

}