const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  });
  FriendSchema.index({ user1: 1, user2: 1 }, { unique: true });

  const Friend = mongoose.models.friends || mongoose.model('friends',FriendSchema);

  export default Friend;