import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_KEY;
if (!JWT_SECRET) {
  throw new Error("JWT_KEY environment variable is not defined");
}

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};