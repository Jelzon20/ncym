import Registration from "../models/registration.model.js";
import { errorHandler } from "../utils/error.js";


export const register = async (req, res, next) => {

  const { dioceseOrOrg, parishOrLocalUnit, title, nickname, birthday, contactNumber, shirtSize, roleInMinistry, address, emerContactPerson, emerRelation, emerContactNumber, allergy, medication, diet, disability } = req.body;

  if (
    !dioceseOrOrg ||
    !parishOrLocalUnit ||
    !title ||
    !nickname ||
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
    // ...req.body,
    dioceseOrOrg,
    parishOrLocalUnit,
    title,
    nickname,
    birthday,
    contactNumber,
    shirtSize,
    roleInMinistry,
    address,
    emerContactPerson,
    emerRelation,
    emerContactNumber,
    allergy,
    medication,
    diet,
    disability,
  });
  try {
    await newRegistration.save();
    res.json("Registration successful");
  } catch (error) {
    next(error);
  }
};