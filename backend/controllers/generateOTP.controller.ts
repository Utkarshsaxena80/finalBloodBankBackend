

import {Request,Response} from 'express'

const sendOTP1=async(req:Request,res:Response)=>{
    const {email}:{email:string}=req.body
    //send and generate the otp 
    //temporarily save the otp 

}
export {sendOTP1}