import { Router } from "express";
import * as userController from '../../controllers/user.controller.js'
import AuthMiddleWare from "../../middleWare/authMiddleware.js"
const router = Router()


router.get('/',AuthMiddleWare,userController.get)
router.get('/user/:id',AuthMiddleWare,userController.userPage)
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post('/userSearch',AuthMiddleWare, userController.userSearch)
router.post('/followUser',AuthMiddleWare, userController.userFollow)
router.post('/unfollowUser',AuthMiddleWare, userController.userUnfollow)
export default router