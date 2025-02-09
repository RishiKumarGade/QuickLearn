const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
    user1: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    createdAt: { type: Date, default: Date.now }
  });
  const Friend = mongoose.models.friends || mongoose.model('friends',FriendSchema);

  export default Friend;

  