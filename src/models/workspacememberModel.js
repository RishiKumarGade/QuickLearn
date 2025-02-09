const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WorkspaceMemberSchema = new Schema({
    workspace: { type: Schema.Types.ObjectId, ref: 'workspaces', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    joinedAt: { type: Date, default: Date.now }
  });

  const WorkspaceMember = mongoose.models.workspacemembers || mongoose.model('workspacemembers',WorkspaceMemberSchema);

export default WorkspaceMember;