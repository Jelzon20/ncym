import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    capacity_based: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop'
    },
    issue_based: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop'
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;