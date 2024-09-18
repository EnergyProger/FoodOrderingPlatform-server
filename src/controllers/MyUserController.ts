import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (request: Request, response: Response) => {
  try {
    const currentUser = await User.findOne({ _id: request.userId });

    if (!currentUser) {
      return response.status(404).json({ message: "User not found" });
    }

    response.json(currentUser);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error fetching user" });
  }
};

const createCurrentUser = async (request: Request, response: Response) => {
  try {
    const { auth0Id } = request.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return response.status(200).send();
    }

    const newUser = new User(request.body);
    await newUser.save();

    response.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error creating user" });
  }
};

const updateCurrentUser = async (request: Request, response: Response) => {
  try {
    const { name, addressLine1, country, city } = request.body;
    const user = await User.findById(request.userId);

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    response.send(user);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error updating user" });
  }
};

export default { getCurrentUser, createCurrentUser, updateCurrentUser };
