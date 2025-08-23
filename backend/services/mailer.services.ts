import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,        
    pass: process.env.GMAIL_APP_PASS,    
  },
});
export async function sendMail(to: string, subject: string, text1: string) {
  try {
    const text=`Your OTP for ${to} authentication is ${text1}`
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}


