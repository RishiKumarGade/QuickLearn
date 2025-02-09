// Friend Functions

import Friend from '@/models/friendModel.js'
import FriendRequest from '@/models/friendrequestModel.js'


  export const acceptFriendRequest = async (requestId) => {
    const request = await FriendRequest.findByIdAndDelete(requestId);
    console.log(request)
    await Friend.create({
      user1: request.sender,
      user2: request.receiver
    }).then((res)=>{
      console.log(res)
    }).catch((err) => {console.log(err)});
  };
