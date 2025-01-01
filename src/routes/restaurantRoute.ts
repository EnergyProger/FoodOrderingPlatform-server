import express from "express";
import {
  validateSearchRestaurantDetailRequest,
  validateSearchRestaurantRequest,
} from "../middleware/validation";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get(
  "/:restaurantId",
  validateSearchRestaurantDetailRequest,
  RestaurantController.getRestaurant
);

router.get(
  "/search/:city",
  validateSearchRestaurantRequest,
  RestaurantController.searchRestaurant
);

export default router;
