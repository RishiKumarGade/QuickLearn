import User from '@/models/userModel';
import FriendRequest from '@/models/friendrequestModel.js'


const getFriendRequests = async (userId) => {
    return FriendRequest.find({ receiver:userId}).populate('sender')
  };

  export default getFriendRequests;
