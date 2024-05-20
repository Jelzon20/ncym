import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  if(token) {
      res.json({hasToken: true});
  }else{
    res.json({hasToken: false});
  }
    
};

export const signup = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  if (
    !email ||
    !password ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  // const jwtOptions = { expiresIn: '2h' };

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }
  try {
    const validUser = await User.findOne({ email })
    .populate('capacity_based', ['title'])
    .populate('issue_based', ['title'])
    if (!validUser){
      return next(errorHandler(404, 'User not Found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'))
    }
    const token = jwt.sign(
      { id: validUser._id, 
        isAdmin: validUser.isAdmin 
      },
      process.env.JWT_SECRET, 
      // jwtOptions
    );

    const { password: pass, ...rest } = validUser._doc;
    
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

export const google = async (req, res, next) => {
  const { email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email })
    .populate('capacity_based', ['title'])
    .populate('issue_based', ['title'])
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};