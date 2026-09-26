import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
  token: { 
    type: String, 
    required: true, 
    unique: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '15m'
  }
});

export const blacklistModel = mongoose.model('Blacklist', blacklistSchema);

