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
    userId: req.user.id,
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

export const getRegistration = async (req, res, next) => {
  try {
    // console.log(req.params.regId);
    // const user = await User.findById(req.user.id);
    const registration = await Registration.findOne({userId: req.user.id});
    if (!registration){
      return next(errorHandler(404, 'Registration not found'));
    }
    const { ...rest } = registration._doc;
    res.status(200).json(rest);
      
  } catch (error) {
    next(error);
  }
};