import { Router } from "express";
import * as userController from '../../controllers/user.controller.js'
const router = Router()


router.get('/',userController.get)
router.get('/user/:id',userController.userPage)
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post('/userSearch', userController.userSearch)
router.post('/followUser', userController.userFollow)
export default router