import express from "express";
import { unifiedRegistration } from "../controllers/bbRegis.controllers.ts";
import { protectRouteAndCheckEmail } from "../middleware/auth.middleware.ts";
const bbRegis = express.Router();

bbRegis.post("/blood-bank", protectRouteAndCheckEmail, unifiedRegistration);

export default bbRegis;
