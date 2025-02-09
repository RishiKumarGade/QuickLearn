const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkSpaceSchema = new Schema({
  title: String,
  description: String,
  ownerId: { type: Schema.Types.ObjectId, ref: "users" },
  isCompleted: { type: Boolean, default: false },
  skillTag: String,
  type: { type: String, enum: ["PROJECT", "SKILL", "REFER"] },
  progress:{type:Number,default:0}
});

const WorkSpace = mongoose.models.workspaces || mongoose.model('workspaces',WorkSpaceSchema);

export default WorkSpace;