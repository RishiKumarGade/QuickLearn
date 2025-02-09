const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const InvitationSchema = new Schema({
    workspace: { type: Schema.Types.ObjectId, ref: 'WorkSpace', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Invitation = mongoose.models.invitations || mongoose.model('invitations',InvitationSchema);

  export default Invitation