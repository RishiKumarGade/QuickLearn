import Friend from '@/models/friendModel.js'


const getFriends = async (userId) => {
  const friends = await Friend.find({
    $or: [{ user1: userId }, { user2: userId }]
  }).populate('user1 user2');

  return friends.map(friend => 
    friend.user1._id.toString() === userId.toString() 
      ? friend.user2 
      : friend.user1
  );
};

  export default getFriends;