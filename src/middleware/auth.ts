import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
});

export const jwtParse = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { authorization } = request.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return response.sendStatus(401);
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return response.sendStatus(401);
    }

    request.auth0Id = auth0Id as string;
    request.userId = user._id.toString();

    next();
  } catch (error) {
    console.log(error);
    return response.sendStatus(401);
  }
};
