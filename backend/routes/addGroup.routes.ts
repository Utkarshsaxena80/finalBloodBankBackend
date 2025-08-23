import express from 'express'
import { checkToken } from '../middleware/checkToken.middleware.ts'
import { createGroup } from '../controllers/createGroup.controller.ts'

const addGroup=express.Router()

addGroup.post('/v1',checkToken,createGroup);
export default addGroup;