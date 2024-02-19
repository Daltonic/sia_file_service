require('dotenv').config()
import jwt from 'jsonwebtoken'

export function verifyAccessToken<T>(accessToken: string): T | null {
  try {
    console.log(process.env.ACCESS_TOKEN_SECRET_KEY)
    console.log(accessToken)
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY!
    ) as T
    console.log(decoded)
    return decoded
  } catch (e: any) {
    return null
  }
}
