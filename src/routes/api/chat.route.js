import { Router } from "express";
import * as chatController from '../../controllers/chat.controller.js'

const router = Router()

router.get('/getChat/:id' , chatController.getChat)

export default router