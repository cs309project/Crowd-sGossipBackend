import { Router } from "express";
import * as userController from '../controllers/user.controller.js'
const router = Router()

router.get('/users',userController.get)
export default router