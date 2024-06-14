import Session from "../models/session.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "SESSION API is working" });
};

export const addSession = async (req, res, next) => {
  const { title } = req.body;
  if (!title || title === "") {
    next(errorHandler(400, "All fields are required"));
  }

  const newSession = new Session({
    title,
  });
  try {
    await newSession.save();
    res.json("New session added successful");
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ isActive: "true" })

    res.status(200).json({
      sessions: sessions,
    });
  } catch (error) {
    next(error);
  }
};

export const addAttendance = async (req, res, next) => {
  const { session, userId } = req.body;
  if (!session || session === "") {
    next(errorHandler(400, "session ID is required"));
  }
  try {
  const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

  const checkDuplicateAttendance = await Session.find({_id: new mongoose.Types.ObjectId(session)}); 
  const attendeesArray = checkDuplicateAttendance[0].attendees;
  if(attendeesArray.includes(userId)) {
    return next(errorHandler(400, "User has record in this session"));
  }
         
    await Session.findByIdAndUpdate(session, {
      $push: {  
        attendees: userId,
      },
    });
    res.status(200).json({ message: "Attendance has been recorded." });
  } catch (error) {
    next(error);
  }
  // }



};

export const getAttendance = async (req, res, next) => {
  try {

    const attendees = await Session.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.sessionId) } },
      {
        $lookup: {
          from: "registrations",
          localField: "attendees",
          foreignField: "user",
          as: "user_details"
        }
      },
    ]);

    res.status(200).json({
      attendance: attendees
    });


  } catch (error) {
    next(error);
  }
};