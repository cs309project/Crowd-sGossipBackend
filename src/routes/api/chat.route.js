import { Router } from "express";
import * as chatController from '../../controllers/chat.controller.js'

const router = Router()

router.get('/getChat' , chatController.getChat)

export default router