import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    attendees : {
        type : [mongoose.Schema.Types.ObjectId],
       default : [] 
     },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;