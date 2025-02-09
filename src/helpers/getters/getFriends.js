import Friend from '@/models/friendModel.js'


const getFriends = async (userId) => {
    return Friend.find({
      $or: [{ user1: userId }, { user2: userId }]
    }).populate('user1 user2');
  };


  export default getFriends;