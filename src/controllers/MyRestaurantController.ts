import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

const getMyRestaurant = async (request: Request, response: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: request.userId });

    if (!restaurant) {
      return response.status(404).json({ message: "Restaurant not found" });
    }

    response.json(restaurant);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error fetching restaurant" });
  }
};

const createMyRestaurant = async (request: Request, response: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({
      user: request.userId,
    });

    if (existingRestaurant) {
      return response
        .status(409)
        .json({ message: "User restaurant already exists" });
    }

    const imageUrl = await uploadImage(request.file as Express.Multer.File);

    const restaurant = new Restaurant(request.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(request.userId);
    restaurant.lastUpdated = new Date();

    await restaurant.save();

    response.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error creating restaurant" });
  }
};

const updateMyRestaurant = async (request: Request, response: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: request.userId,
    });

    if (!restaurant) {
      return response.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.restaurantName = request.body.restaurantName;
    restaurant.city = request.body.city;
    restaurant.country = request.body.country;
    restaurant.deliveryPrice = request.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = request.body.estimatedDeliveryTime;
    restaurant.cuisines = request.body.cuisines;
    restaurant.menuItems = request.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (request.file) {
      const imageUrl = await uploadImage(request.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();

    response.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error updating restaurant" });
  }
};

const getMyRestaurantOrders = async (request: Request, response: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: request.userId });

    if (!restaurant) {
      return response.status(404).json({ message: "Restaurant not found" });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    response.json(orders);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error fetching orders" });
  }
};

const updateOrderStatus = async (request: Request, response: Response) => {
  try {
    const { orderId } = request.params;
    const { status } = request.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return response.status(404).json({ message: "Order not found" });
    }

    const restaurant = await Restaurant.findById(order.restaurant);

    if (restaurant?.user?._id.toString() !== request.userId) {
      return response.status(401).send();
    }

    order.status = status;
    await order.save();

    response.status(200).json(order);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error updating order status" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default {
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
  updateOrderStatus,
};
