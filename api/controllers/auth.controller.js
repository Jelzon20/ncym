import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    firstname === "" ||
    lastname === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.json("Sign up successful");
  } catch (error) {
    next(error);
  }
};