import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";
import HttpException from "../utils/HttpExceptions";
import { StatusCodes } from "http-status-codes";

// Grab user from the accessToken that is passed in from the header;

export default async function deserialiseUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Grab the access token from the header;
  const accessToken = (req.headers.authorization || "").replace(
    /^Bearer\s/,
    ""
  );
  console.log(accessToken);

  try {
    if (!accessToken) {
      return next(
        new HttpException(
          StatusCodes.UNAUTHORIZED,
          "Not authorised to access this route"
        )
      );
    }

    const decoded = verifyAccessToken(accessToken);
    console.log(decoded);

    return next();
  } catch (e: any) {
    return next(
      new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Not authorised to access this route"
      )
    );
  }
}
