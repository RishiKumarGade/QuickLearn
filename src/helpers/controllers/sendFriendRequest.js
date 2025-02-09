import FriendRequest from '@/models/friendrequestModel.js'

const sendFriendRequest = async (senderId, receiverId) => {
    return FriendRequest.create({
      sender: senderId,
      receiver: receiverId
    });
  };
  

export default sendFriendRequest