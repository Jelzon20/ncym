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


  export const getWorkshops = async (req, res, next) => {
    try {
      const workshops = await Workshop.find()
        // .sort({ createdAt: sortDirection })
        // .skip(startIndex)
        // .limit(limit);
  
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

