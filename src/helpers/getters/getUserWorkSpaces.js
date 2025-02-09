import WorkspaceMember from '@/models/workspacememberModel';
import WorkSpace from '@/models/workspaceModel.js'


const getUserWorkspaces = async (userId) => {
  const owned = await WorkSpace.find({ ownerId: userId });
  const memberOf = await WorkspaceMember.find({ user: userId }).populate('workspace');
  return [...owned, ...memberOf.map(m => m.workspace)];
};

export default getUserWorkspaces;