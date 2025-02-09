import WorkspaceMember from '@/models/workspacememberModel'

 
const getWorkspaceMembers = async (workspaceId) => {
  return WorkspaceMember.find({ workspace: workspaceId }).populate('user');
};


export default getWorkspaceMembers