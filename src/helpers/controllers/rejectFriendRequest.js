import FriendRequest from '@/models/friendrequestModel.js'

const rejectFriendRequest = async (requestId) => {
    const request = await FriendRequest.findByIdAndDelete(requestId);
  };

export default rejectFriendRequest;