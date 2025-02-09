// Friend Functions

import Friend from '@/models/friendModel.js'
import FriendRequest from '@/models/friendrequestModel.js'


  export const acceptFriendRequest = async (requestId) => {
    const request = await FriendRequest.findByIdAndDelete(requestId);
    await Friend.create({
      user1: request.sender,
      user2: request.receiver
    });
  };
