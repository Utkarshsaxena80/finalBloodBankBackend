import express from "express";
import { resendOTP1, sendOTP1} from "../controllers/generateOTP.controller.ts";
import { verifyOTP } from "../controllers/veriftOTP.controller.ts";
const sendOTP = express.Router();

sendOTP.post("/send",sendOTP1);
sendOTP.post("/resend",resendOTP1)
sendOTP.post("/verify",verifyOTP)

export default sendOTP;
