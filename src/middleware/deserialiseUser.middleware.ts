import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/token'
import HttpException from '../utils/HttpExceptions'
import { StatusCodes } from 'http-status-codes'

export default async function deserialiseUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Grab the access token from the header;
    const accessToken = (req.headers.authorization || '').replace(
      /^Bearer\s/,
      ''
    )

    if (!accessToken) {
      return next()
    }

    const decoded = await verifyAccessToken(accessToken)

    if (decoded) {
      res.locals.user = decoded
      return next()
    } else {
      return next(
        new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid Access token')
      )
    }
  } catch (error: any) {
    // Handle the error appropriately, for example, by passing it to the next middleware
    next(new HttpException(StatusCodes.UNAUTHORIZED, error.message))
  }
}
