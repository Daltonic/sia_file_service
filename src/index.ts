require('dotenv').config()
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import fileupload from 'express-fileupload'
import { FileUpload } from './utils/interfaces'
import { StatusCodes } from 'http-status-codes'
import HttpException from './utils/HttpExceptions'
import SiaService from './services/sia.service'
import BackgroundService from './services/background.service'
import deserialiseUser from './middleware/deserialiseUser.middleware'
import filterDomains from './middleware/filterDomains.middleware'
import path from 'path'
import fs from 'fs'

const app = express()
const port = process.env.PORT
const siaService = new SiaService()

app.use(cors())
app.use(fileupload())

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(StatusCodes.OK).json({ message: 'Welcome' })
  } catch (error: any) {
    next(new HttpException(StatusCodes.BAD_REQUEST, error.message))
  }
})

// Set up a route for file uploads
app.post(
  '/upload',
  deserialiseUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!res.locals.user) {
        return next(
          new HttpException(
            StatusCodes.UNAUTHORIZED,
            'Invalid Authorization Key'
          )
        )
      }

      if (!req.files) {
        throw new HttpException(StatusCodes.NO_CONTENT, 'No file uploaded')
      }

      const fileUpload: FileUpload = req.files.file as FileUpload

      const result = await siaService.uploadFile(fileUpload)
      return res.status(StatusCodes.CREATED).json(result)
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message))
    }
  }
)

app.get(
  '/download/image/:fileId',
  async (req: Request, res: Response, next: NextFunction) => {
    const { fileId } = req.params
    try {
      if (!fileId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Folder or File ID not found' })
      } else {
        const folder = 'image'
        const result = await siaService.downloadFile(folder, fileId)
        return result.pipe(res).status(StatusCodes.OK)
      }
    } catch (error: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, error.message))
    }
  }
)

app.get(
  '/download/:folder/:fileId',
  filterDomains,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.whitelisted) {
      console.log('WhiteList checking: ', res.locals.whitelisted)
      console.log('Origin checking: ', res.locals.origin)
      const protectedContent = path.resolve(
        __dirname,
        '..',
        'response_files',
        '401.png'
      )
      return fs
        .createReadStream(protectedContent)
        .pipe(res)
        .status(StatusCodes.UNAUTHORIZED)
    }

    const { folder, fileId } = req.params

    try {
      if (!folder || !fileId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Folder or File ID not found' })
      } else {
        const result = await siaService.downloadFile(folder, fileId)
        return result.pipe(res).status(StatusCodes.OK)
      }
    } catch (error: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, error.message))
    }
  }
)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  new BackgroundService()
})
