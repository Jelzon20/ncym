import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import Registration from '../models/registration.model.js';
import Workshop from '../models/workshop.model.js';
import nodemailer from 'nodemailer';
import path from 'path';

export const test = (req, res) => {
  res.json({ message: 'API is working'});
}

export const enrollUser = async (req, res, next) => {
  let notEmptyField;
  const {
    capacity_based,
    issue_based
  } = req.body;


  // Build socialFields object
  const workshop = { capacity_based, issue_based };

  for (const [key, value] of Object.entries(workshop)) {
    if (value && value.length > 0){
      workshop[key] = value;
      if(value !== undefined) {
        notEmptyField = value;
      }
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
         ...req.body
        },
      },
      { new: true }
    ).populate('capacity_based', ['title'])
    .populate('issue_based', ['title']);

    await Workshop.findByIdAndUpdate(
      notEmptyField,
      {
        $push: {
         participants: req.params.userId
        },
        $inc: { slots: -1 }
      },
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
 
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
 
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
          isAdmin: req.body.isAdmin,
          isRegistered: req.body.isRegistered,
          isAccepted: req.body.isAccepted,
          isActive: req.body.isActive
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const regs = await Registration.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const registrations = regs.map((reg) => {
      const { ...rest } = reg._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const sendEmail = async (req, res, next) => {
  // res.json({ message: 'API is working'});

const to_email = req.params.email
console.log(to_email);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: 'ncym2020rcap@gmail.com',
    pass: 'tbci zirl cjyu rkca'
  }
});

var mailOptions = {
  from: 'ncym2020rcap@gmail.com',
  to: to_email,
  subject: 'Registration Verification - NCYM 2024',
  html: `<p>Greetings, fellow servants of the Lord! <br> <br> We are delighted to inform you of your full acceptance as a participant in the National Conference of Youth Ministers 2024, scheduled to be held in the Archdiocese of Palo from July 17-21, 2024. <br> <br> Furthermore, we kindly request your enrollment in one issue-based mini-conference and one capacity-based workshop among those provided for NCYM 2024. <br> <br> For any further inquiries, please do not hesitate to reach out to us using the contact details provided below. <br> <br> On behalf of the NCYM 2024 Organizing Team, we extend our heartfelt gratitude and eagerly anticipate meeting you and the young people accompanying you in Palo soon. May God bless us all in our mission for the youth! <br> <br> Sincerely yours in Christ, <br> <br> NCYM 2024 Organizing Team <br> <br> SANGKAY: See you Leyte, It's GR8 here!</p> <br> <br> <img src = "cid:myImg" style="width:400px;height:400px;"/>`,
  attachments: [{
        filename: 'webLogo.png',
        path: __dirname + '/api/images/webLogo.png',
        cid: 'myImg'
      }]
};

transporter.sendMail(mailOptions, (error, info) => {
  
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}
