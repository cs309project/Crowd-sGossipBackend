import { Router } from "express";
import * as userController from '../../controllers/user.controller.js'
const router = Router()


router.get('/',userController.get)
router.get('/user/:id',userController.userPage)
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get('/userSearch', userController.userSearch)
export default router