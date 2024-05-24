import Session from "../models/session.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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
