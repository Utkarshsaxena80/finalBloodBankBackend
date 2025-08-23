import express from 'express'
import { getBloodBanks } from '../controllers/getBloodBanks.controller.ts'
import { checkToken } from '../middleware/checkToken.middleware.ts'
const addGroup=express.Router()

addGroup.post('/',checkToken ,getBloodBanks)
export default addGroup