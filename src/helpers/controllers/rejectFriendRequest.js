import FriendRequest from '@/models/friendrequestModel.js'

export default rejectFriendRequest = async (requestId) => {
    const request = await FriendRequest.findByIdAndDelete(requestId);
  };
  