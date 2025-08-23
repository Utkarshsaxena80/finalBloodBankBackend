import express from 'express'
import { getBloodBanks } from '../controllers/getBloodBanks.controller.ts'
const getBanks=express.Router()

getBanks.get('/',getBloodBanks)
export default getBanks