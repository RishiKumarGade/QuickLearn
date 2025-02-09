import FriendRequest from '@/models/friendrequestModel.js'


  export default getFriendRequests = async (userId) => {
    return FriendRequest.find({ receiver:userId}).populate('sender')
  };
