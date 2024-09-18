import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("AddressLine1 must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  handleValidationErrors,
];
