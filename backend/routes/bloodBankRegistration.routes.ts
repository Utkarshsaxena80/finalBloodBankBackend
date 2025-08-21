import express from "express";
import { unifiedRegistration } from "../controllers/bbRegis.controllers.ts";
const bbRegis = express.Router();

bbRegis.post("/blood-bank", unifiedRegistration);

export default bbRegis;
