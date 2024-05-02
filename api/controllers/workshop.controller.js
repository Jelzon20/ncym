import userSlice from "../../client/src/redux/user/userSlice.js";
import Registration from "../models/registration.model.js";
import User from "../models/user.model.js";
import Workshop from "../models/workshop.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
    res.json({ message: 'API is working'});
  }

  export const addWorkshop = async (req, res, next) => {
    const { title, description, slots, workshopType, workshopCategory } = req.body;
  
    if (
      !title ||
      !description ||
      !slots ||
      !workshopType ||
      !workshopCategory ||
      title === "" ||
      description === "" ||
      slots === "" ||
      workshopCategory === "" ||
      workshopType === ""
    ) {
      next(errorHandler(400, 'All fields are required'));
    }
  
    const newWorkshop = new Workshop({
      title,
      description,
      slots,
      workshopType,
      workshopCategory
      
    });
    try {
      await newWorkshop.save();
      res.json("New workshop added");
    } catch (error) {
      next(error);
    }
  };

  export const getParticipants = async (req, res, next) => {
    // res.json({ message: 'API Participant is working'});
    try {
      const participants = await Workshop.aggregate([
        {
          $lookup: {
            from: "registrations", 
            localField: "participants",
            foreignField: "user",
            as: "user_details"
          }
        }
      ]);
      

      res.status(200).json({
        participants: participants
      });

      
      
    } catch (error) {
      next(error);
    }
  };


  export const getWorkshops = async (req, res, next) => {
    try {
      const workshops = await Workshop.find()
  
      const workshopsMap = workshops.map((workshop) => {
        const { ...rest } = workshop._doc;
        return rest;
      });
  
      res.status(200).json({
        workshops: workshopsMap,
      });
    } catch (error) {
      next(error);
    }
  };

  export const getWorkshop = async (req, res, next) => {

    try {
      
      const workshop = await Workshop.findById(req.params.workshopId);
      if (!workshop){
        return next(errorHandler(404, 'Workshop not found'));
      }
      const { ...rest } = workshop._doc;
      res.status(200).json(rest);
        
    } catch (error) {
      next(error);
    }
  };



