import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.utils.ts';
import { generateToken } from '../utils/jwt.utils.ts';

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp }: { email: string; otp: string } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required." });
  }
  try {
    const otpRecord = await prisma.oTP.findUnique({
      where: { identifier: email },
    });
    if (!otpRecord) {
      return res.status(404).json({ error: "OTP not found. Please request a new one." });
    }
    const now = new Date();
    if (now > otpRecord.expiresAt) {
     
      await prisma.oTP.delete({ where: { identifier: email } });
      return res.status(410).json({ error: "OTP has expired. Please request a new one." });
    }
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP provided." });
    }
    await prisma.oTP.delete({
      where: { identifier: email },
    });
    //create jwt token 
    try{
        const token= generateToken(email)
            res.cookie('jwt', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV !== 'development', 
            sameSite: 'strict',
            maxAge: 7* 24 * 60 * 60 * 1000,   
        });
         return res.status(200).json({ message: "Email verified and token set successfully." });
    }
    catch(error){
        console.log(error)
    }
  } catch (error) {
    console.error('Error in verifyOTP controller:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
};