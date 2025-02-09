import Invitation from '@/models/invitationModel.js'
import WorkspaceMember from '@/models/workspacememberModel.js'
  
const acceptWorkspaceInvite = async (inviteId) => {
    const invitation = await Invitation.findByIdAndDelete(inviteId);
    return WorkspaceMember.create({
      workspace: invitation.workspace,
      user: invitation.receiver
    });
  };

  export default acceptWorkspaceInvite