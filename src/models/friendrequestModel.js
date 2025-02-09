const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FriendRequestSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  });
  FriendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });


const FriendRequest = mongoose.models.friendrequests || mongoose.model('friendrequests',FriendRequestSchema);

export default FriendRequest;
