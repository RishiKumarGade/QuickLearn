import FriendRequest from '@/models/friendrequestModel.js'

  export default sendFriendRequest = async (senderId, receiverId) => {
    return FriendRequest.create({
      sender: senderId,
      receiver: receiverId
    });
  };
  