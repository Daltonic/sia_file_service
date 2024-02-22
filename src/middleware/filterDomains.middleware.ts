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
    const headers: { [key: string]: string } = {}

    for (let i = 0; i < req.rawHeaders.length; i += 2) {
      headers[req.rawHeaders[i]] = req.rawHeaders[i + 1].endsWith('/')
        ? req.rawHeaders[i + 1].slice(0, -1)
        : req.rawHeaders[i + 1]
    }
    console.log(res.locals.whitelisted, headers.Referer)
    res.locals.whitelisted = whitelist.includes(headers.Referer)

    return next()
  } catch (error: any) {
    // Handle the error appropriately, for example, by passing it to the next middleware
    next(new HttpException(StatusCodes.UNAUTHORIZED, error.message))
  }
}
