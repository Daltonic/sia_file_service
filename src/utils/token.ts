require('dotenv').config()
import jwt from 'jsonwebtoken'

export function verifyAccessToken<T>(accessToken: string): T | null {
  try {
    console.log(process.env.ACCESS_TOKEN_SECRET_KEY)
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY!
    ) as T
    return decoded
  } catch (e: any) {
    return null
  }
}
