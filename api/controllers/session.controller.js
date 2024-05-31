import Session from "../models/session.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
    const sessions = await Session.find()

    res.status(200).json({
      sessions: sessions,
    });
  } catch (error) {
    next(error);
  }
};

export const addAttendance = async (req, res, next) => {
  const { userId } = req.body;
  const sessionTitle = req.params.sessionTitle;
  if (!userId || userId === "") {
    next(errorHandler(400, "User ID is required"));
  }
  try {
    await Session.findByIdAndUpdate(sessionTitle, {
      $push: {
        attendees: userId,
      },
    });
    res.json("Attendance has been recorded.");
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {

    const attendees = await Session.aggregate([
      {$match: { _id: new mongoose.Types.ObjectId(req.params.sessionId) }},
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
      attendees: attendees
    });
    
    
  } catch (error) {
    next(error);
  }
};