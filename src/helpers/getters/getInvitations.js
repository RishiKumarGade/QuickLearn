
import Invitation from '@/models/invitationModel.js'

export const getWorkspaceInvitations = async (userId) => {
    return Invitation.find({ receiver: userId }).populate('sender workspace');
  };