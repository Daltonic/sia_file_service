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
    res.locals.origin = headers.Referer
    res.locals.whitelisted = whitelist.includes(headers.Referer)
    console.log(headers.Referer, 'whitelisted', res.locals.whitelisted)

    return next()
  } catch (error: any) {
    next(new HttpException(StatusCodes.UNAUTHORIZED, error.message))
  }
}
