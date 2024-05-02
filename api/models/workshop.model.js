import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    workshopType: {
        type: String,
        required: true,
      },
    description: {
      type: String,
      required: true,
    },
    participants : {
         type : [mongoose.Schema.Types.ObjectId],
        default : [] 
      },
    slots: {
        type: Number,
        required: true,
      },
    workshopCategory: {
        type: String,
        required: true,
      },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Workshop = mongoose.model('Workshop', workshopSchema);

export default Workshop;