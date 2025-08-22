
import {Request,Response} from 'express'
import {prisma} from '../utils/prisma.utils.ts'
import {resend} from '../utils/resend_email.utils.ts'
const sendOtpService=async(email:string,otp:string)=>{
resend.emails.send({
  from: 'utkarshsaxena851@gmail.com',
  to: email,
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
})
}
const sendOTP1=async(req:Request,res:Response)=>{
    const {email}:{email:string}=req.body
   if(!email){
    res.status(400).json({error:'Email is required'})
   }
   try{
       const otp=Math.floor(100000+Math.random()*900000).toString()
       const expiresAt= new Date(Date.now()+10*60*1000)

       await prisma.oTP.upsert({
        where:{identifier:email},
        update:{
            otp:otp,
            expiresAt:expiresAt,
        },
        create:{
            identifier:email,
            otp:otp,
            expiresAt:expiresAt
        },
       })
       await sendOtpService(email,otp)
         return res.status(200).json({ message: 'OTP has been sent successfully to your email.' });
   }catch (error){
     console.error('Error in sendOTP1 controller:', error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
   }
}
export {sendOTP1}

export const resendOTP1 = async (req: Request, res: Response) => {
    const { email }: { email: string } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        const existingOtp = await prisma.oTP.findUnique({
            where: { identifier: email },
        });

        if (!existingOtp) {
            return res.status(404).json({ error: 'No previous OTP found. Please request a new one.' });
        }
        const now = new Date();
        const updatedAt = new Date(existingOtp.updatedAt);
        const diffInSeconds = (now.getTime() - updatedAt.getTime()) / 1000;
        const cooldownSeconds = 60; 
        if (diffInSeconds < cooldownSeconds) {
            const timeLeft = Math.ceil(cooldownSeconds - diffInSeconds);
            return res.status(429).json({ error: `Please wait ${timeLeft} seconds before resending.` });
        }
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.oTP.update({
            where: { identifier: email },
            data: {
                otp: newOtp,
                expiresAt: newExpiresAt,
            },
        });

        await sendOtpService( email, newOtp );

        return res.status(200).json({ message: 'A new OTP has been sent successfully.' });

    } catch (error) {
        console.error('Error in resendOTP1 controller:', error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
};