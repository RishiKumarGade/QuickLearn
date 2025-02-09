const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WorkspaceMemberSchema = new Schema({
    workspace: { type: Schema.Types.ObjectId, ref: 'WorkSpace', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now }
  });
  WorkspaceMemberSchema.index({ workspace: 1, user: 1 }, { unique: true });

  const WorkspaceMember = mongoose.models.workspacemembers || mongoose.model('workspacemembers',WorkspaceMemberSchema);

export default WorkspaceMember;