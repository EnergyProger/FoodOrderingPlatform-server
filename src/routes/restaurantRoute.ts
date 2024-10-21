import express, { Request, Response } from "express";
import { validateSearchRestaurantRequest } from "../middleware/validation";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get(
  "/search/:city",
  validateSearchRestaurantRequest,
  RestaurantController.searchRestaurant
);

export default router;
