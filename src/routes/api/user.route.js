import { Router } from "express";
import * as userController from '../../controllers/user.controller.js'
const router = Router()


router.get('/',userController.get)
router.post("/register", userController.register);
router.post("/login", userController.login);
export default router
