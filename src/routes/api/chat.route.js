import { Router } from "express";
import * as chatController from '../../controllers/chat.controller.js'
import AuthMiddleWare from "../../middleWare/authMiddleware.js"

const router = Router()

router.get('/getChat/:id' ,AuthMiddleWare, chatController.getChat)

export default router