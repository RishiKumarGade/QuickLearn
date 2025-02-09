import Invitation from '@/models/invitationModel.js'
const sendWorkspaceInvite = async (workspaceId, senderId, receiverId) => {
  console.log(receiverId)
    return Invitation.create({
      workspace: workspaceId,
      sender: senderId,
      receiver: receiverId
    }).catch((err)=>{console.error(err)});
  };
   
 export default sendWorkspaceInvite