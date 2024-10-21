import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import { RESTAURANT_SEARCH_PAGE_SIZE } from "../common/constants";

const searchRestaurant = async (request: Request, response: Response) => {
  try {
    const city = request.params.city;

    const searchQuery = (request.query.searchQuery as string) || "";
    const selectedCuisines = (request.query.selectedCuisines as string) || "";
    const sortOption = (request.query.sortOption as string) || "lastUpdated";
    const page = parseInt(request.query.page as string) || 1;

    const query: any = {};

    query["city"] = new RegExp(city, "i");

    const cityCheck = await Restaurant.countDocuments(query);

    if (cityCheck === 0) {
      return response.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));

      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const skip = (page - 1) * RESTAURANT_SEARCH_PAGE_SIZE;

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(RESTAURANT_SEARCH_PAGE_SIZE)
      .lean();

    const total = await Restaurant.countDocuments(query);

    const responseSearchRestaurants = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / RESTAURANT_SEARCH_PAGE_SIZE),
      },
    };

    response.json(responseSearchRestaurants);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error fetching restaurants" });
  }
};

export default { searchRestaurant };
