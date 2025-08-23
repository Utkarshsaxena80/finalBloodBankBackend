import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils.ts';
import { prisma } from '../utils/prisma.utils.ts';

// This interface defines the structure of the decoded JWT payload
interface TokenPayload {
  userId: string;
}

/**
 * @description Express middleware to protect routes.
 * It verifies a JWT from cookies and checks if the user's email
 * matches the email provided in the request body.
 */

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided. Please log in.' });
    }
    const decoded = verifyToken(token) as TokenPayload;

    const userIdFromToken = decoded.userId;

     console.log(userIdFromToken)

    if (!userIdFromToken) {
      return res.status(404).json({ error: 'User not found.' });
    }
   const email1=await prisma.admin.findUnique({
    where:{email:userIdFromToken}
   })
    if (!email1) {
      return res.status(400).json({ error: 'Bad Request: Email must be provided in the request body.' });
    }
    console.log("user permitteed to go further")
    next();

  } catch (error) {
   
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Unauthorized: Token has expired.' });
      }
    }    
    console.error("Authentication middleware error:", error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
};