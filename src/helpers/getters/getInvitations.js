
import Invitation from '@/models/invitationModel.js'

const getWorkspaceInvitations = async (userId) => {
    return Invitation.find({ receiver: userId }).populate('sender workspace');
  };

export default getWorkspaceInvitations