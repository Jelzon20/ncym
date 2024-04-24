import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    dioceseOrOrg: {
      type: String,
    },
    parishOrLocalUnit: {
      type: String,
    },
    title: {
      type: String,
    },
    firstName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    nickname: {
      type: String,
    },
    birthday: {
      type: String,
      
    },
    contactNumber: {
      type: String,
      
    },
    shirtSize: {
      type: String,
    },

    roleInMinistry: {
      type: String,
      
    },
    address: {
      type: String,
      
    },
    emerContactPerson: {
      type: String,
      
    },
    emerRelation: {
      type: String,
    },
    emerContactNumber: {
      type: String,
     
    },
    allergy: {
      type: String,
      
    },
    medication: {
      type: String,
    },
    diet: {
      type: String,
      
    },
    disability: {
      type: String,
      
    },
    arrivalDate: {
      type: String,
      
    },
    arrivalTime: {
      type: String,
      
    },
    carrierOutOfPalo: {
      type: String,
      
    },
    carrierToPalo: {
      type: String,
      
    },
    departureDate: {
      type: String,
      
    },
    departureTime: {
      type: String,
      
    },
    proofOfPayment: {
      type: String,
      
    },
    waiver: {
      type: String,
      
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;