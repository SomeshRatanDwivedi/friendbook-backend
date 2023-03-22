
const User = require("../../../models/user");

module.exports.fetchUserFriends=async(req, res)=>{
    try{
        const user=await User.findById(req.user._id)
                            .populate('friends')
        return res.status(200).send({
            message:`List of friends of id - ${req.user._id}`,
            success:true,
            data:{
                friends:user.friends
            }
        })


    } catch (error) {
        console.log("error in getting friends", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }
};


module.exports.createFriendship=async(req, res)=>{
    try{

        const {user_id}=req.query;
        const loginUserId=req.user._id;


        const loginUser=await User.findById(loginUserId);
        loginUser.friends.push(user_id);
        loginUser.save();

        const requestUser=await User.findById(user_id);
        requestUser.friends.push(loginUserId);
        requestUser.save();

        return res.status(200).send({
            message:"Now you're friend with Aakash",
            success:true,
            data:{
                newFriend:loginUser
            }

        })



    } catch (error) {
        console.log("error in making friends", error);
        return res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }
}


module.exports.deleteFriendship=async(req, res)=>{
      try{
        const {user_id}= req.query;
        const loginUserId=req.user._id

          const loginUser = await User.findById(loginUserId);
          loginUser.friends.pull(user_id);
          loginUser.save();

          const requestUser = await User.findById(user_id);
          requestUser.friends.pull(loginUserId);
          requestUser.save();

        return res.status(200).send({
            message:'Friend removed',
            success:true
        })
        

      }catch(error){
          console.log("error in removing friends", error);
          return res.status(500).send({
              message: 'Internal server error',
              success: false
          })
      }
}
