import express from "express";
import { sendOTP1} from "../controllers/generateOTP.controller.ts";
const sendOTP = express.Router();

sendOTP.post("/send-otp",sendOTP1);

export default sendOTP;
