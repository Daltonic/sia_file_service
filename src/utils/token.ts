import jwt from "jsonwebtoken";
import HttpException from "./HttpExceptions";
import { StatusCodes } from "http-status-codes";

export function verifyAccessToken<T>(accessToken: string): T | null {
  console.log(process.env.ACCESS_TOKEN_SECRET_KEY);
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY!
    ) as T;
    return decoded;
  } catch (e: any) {
    console.log(e);
    // return null;
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Error validating token");
  }
}
