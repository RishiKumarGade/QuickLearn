import User from '@/models/userModel.js'


export const getUserInfo = async (userId) => {
    return await User.findById(userId)
      .populate('')
  };
  