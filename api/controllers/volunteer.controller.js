import Volunteer from "../models/volunteer.model.js";
import bcryptjs from "bcryptjs";        
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';


export const test = (req, res) => {
    res.json({ message: "API is working" });
};


export const addVolunteer = async (req, res, next) => {
const { username, password } = req.body;
    if (
      !username ||
      !password ||
      username === "" ||
      password === ""
    ) {
      next(errorHandler(400, 'All fields are required'));
    }
  
    const hashedPassword = bcryptjs.hashSync(password, 10);

  
    const newVolunteer = new Volunteer({
      username,
      password: hashedPassword,
    });
    try {
      await newVolunteer.save();
      res.json("New volunteer added successful");
    } catch (error) {
      next(error);
    }
}

export const volunteerSignin = async (req, res, next) => {
    const { password } = req.body;
    // const jwtOptions = { expiresIn: '2h' };
  
    if (!password || password === '') {
      next(errorHandler(400, 'All fields are required'));
    }
    try {
      const validVolunteer = await Volunteer.findOne({ password })
      if (!validVolunteer){
        return next(errorHandler(404, 'Volunteer not Found'));
      }
    //   const validPassword = bcryptjs.compareSync(password, validVolunteer.password);
    //   if (!validPassword) {
    //     return next(errorHandler(400, 'Invalid passcode'))
    //   }
      const token = jwt.sign(
        { id: validVolunteer._id, 
          role: validVolunteer.role 
        },
        process.env.JWT_SECRET, 
      );
  
      const { password: pass, ...rest } = validVolunteer._doc;
      
      res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
    } catch (error) {
      next(error);
    }
  };


  export const volunteerSignout = (req, res, next) => {
    try {
      res
        .clearCookie("access_token")
        .status(200)
        .json("Volunteer has been signed out");
    } catch (error) {
      next(error);
    }
  };