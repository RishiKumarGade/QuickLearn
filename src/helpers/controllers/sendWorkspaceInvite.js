import Invitation from '@/models/invitationModel.js'
 
 export default sendWorkspaceInvite = async (workspaceId, senderId, receiverId) => {
    return Invitation.create({
      workspace: workspaceId,
      sender: senderId,
      receiver: receiverId
    });
  };