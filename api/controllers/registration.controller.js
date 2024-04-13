import Registration from "../models/registration.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";


export const register = async (req, res, next) => {

  const { dioceseOrOrg, parishOrLocalUnit, title, nickname, firstName, lastName, birthday, contactNumber, shirtSize, roleInMinistry, address, emerContactPerson, emerRelation, emerContactNumber, allergy, medication, diet, disability } = req.body;

  if (
    !dioceseOrOrg ||
    !parishOrLocalUnit ||
    !title ||
    !nickname ||
    !firstName ||
    !lastName ||
    !birthday ||
    !contactNumber ||
    !shirtSize ||
    !roleInMinistry ||
    !address ||
    !emerContactPerson ||
    !emerRelation ||
    !emerContactNumber ||
    !allergy ||
    !medication ||
    !diet ||
    !disability ||
    dioceseOrOrg === "" ||
    parishOrLocalUnit === "" ||
    title === "" ||
    nickname === "" ||
    firstName === "" ||
    lastName === "" ||
    birthday === "" ||
    contactNumber === "" ||
    shirtSize === "" ||
    roleInMinistry === "" ||
    address === "" ||
    emerContactPerson === "" ||
    emerRelation === "" ||
    emerContactNumber === "" ||
    allergy === "" ||
    medication === "" ||
    diet === "" ||
    disability === ""

  ) {
    next(errorHandler(400, 'All fields are required'));
    return; // this is optional, Idk how it works :)
  }

  const newRegistration = new Registration({
    user: req.user.id,
    ...req.body,
    // dioceseOrOrg,
    // parishOrLocalUnit,
    // title,
    // nickname,
    // firstName,
    // lastName,
    // birthday,
    // contactNumber,
    // shirtSize,
    // roleInMinistry,
    // address,
    // emerContactPerson,
    // emerRelation,
    // emerContactNumber,
    // allergy,
    // medication,
    // diet,
    // disability,
  });
  try {
    await newRegistration.save();
    const { ...rest } = newRegistration._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getRegs   = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const regs = await Registration.find().populate('user', ['email', 'profilePicture', 'isAdmin', 'isRegistered', 'isAccepted'])
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const registrations = regs.map((reg) => {
      const { ...rest } = reg._doc;
      return rest;
    });

    const totalRegistration = await Registration.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthRegs = await Registration.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      regs: registrations,
      totalRegistration,
      lastMonthRegs,
    });

  } catch (error) {
    next(error);
  }
};

export const getMyReg = async (req, res, next) => {
  try {
    // console.log(req.params.regId);
    // const user = await User.findById(req.user.id);
    const registration = await Registration.findOne({user: req.user.id}).populate('user', ['email', 'profilePicture', 'isAdmin', 'isRegistered', 'isAccepted']);
    if (!registration){
      return next(errorHandler(404, 'Registration not found'));
    }
    const { ...rest } = registration._doc;
    res.status(200).json(rest);
      
  } catch (error) {
    next(error);
  }
};

export const getRegistration = async (req, res, next) => {

  try {
    // console.log(req.params.regId);
    // const user = await User.findById(req.user.id);
    const registration = await Registration.findOne({_id: req.params.regId}).populate('user', ['email', 'profilePicture']);
    if (!registration){
      return next(errorHandler(404, 'Registration not found'));
    }
    const { ...rest } = registration._doc;
    res.status(200).json(rest);
      
  } catch (error) {
    next(error);
  }
};

export const updateReg = async (req, res, next) => {

  if ((req.user.id !== req.params.userId) || req.params.isAdmin == true)  {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  try {
    const updatedReg = await Registration.findByIdAndUpdate(
      req.params.regId,
      {
        $set: {
          dioceseOrOrg: req.body.dioceseOrOrg,
          parishOrLocalUnit: req.body.parishOrLocalUnit,
          title: req.body.title,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nickname: req.body.nickname,
          birthday: req.body.birthday,
          contactNumber: req.body.contactNumber,
          shirtSize: req.body.shirtSize,
          roleInMinistry: req.body.roleInMinistry,
          address: req.body.address,
          emerContactPerson: req.body.emerContactPerson,
          emerRelation: req.body.emerRelation,
          emerContactNumber: req.body.emerContactNumber,
          allergy: req.body.allergy,
          medication: req.body.medication,
          diet: req.body.diet,
          disability: req.body.disability,
        },
      },
      { new: true }
    );
    const {...rest } = updatedReg._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

