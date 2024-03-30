import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
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
    allergies: {
      type: String,
      
    },
    medication: {
      type: String,
    },
    dietaryRequirement: {
      type: String,
      
    },
    disability: {
      type: String,
      
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;