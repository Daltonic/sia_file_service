import { Request, Response, NextFunction } from 'express'
import HttpException from '../utils/HttpExceptions'
import { StatusCodes } from 'http-status-codes'

export default async function filterDomains(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Grab the request origin;
    const whitelist = process.env.DOMAIN_WHITELIST!
    const origin = (req.headers.origin || req.headers.host) as string
    const allowed = whitelist.includes(origin)
    res.locals.whitelisted = allowed

    return next()
  } catch (error: any) {
    // Handle the error appropriately, for example, by passing it to the next middleware
    next(new HttpException(StatusCodes.UNAUTHORIZED, error.message))
  }
}
