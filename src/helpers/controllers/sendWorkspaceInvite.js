import Invitation from '@/models/invitationModel.js'
const sendWorkspaceInvite = async (workspaceId, senderId, receiverId) => {
    return Invitation.create({
      workspace: workspaceId,
      sender: senderId,
      receiver: receiverId
    });
  };
   
 export default sendWorkspaceInvite