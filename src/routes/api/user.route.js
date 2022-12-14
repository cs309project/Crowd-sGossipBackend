import { Router } from "express";
import * as userController from '../../controllers/user.controller.js'
import AuthMiddleWare from "../../middleWare/authMiddleware.js"
const router = Router()


router.get('/',AuthMiddleWare,userController.get)
router.get('/user/:id',AuthMiddleWare,userController.userPage)
router.get('/user',AuthMiddleWare,userController.userPage)
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post('/userSearch',AuthMiddleWare, userController.userSearch)
router.post('/followUser',AuthMiddleWare, userController.userFollow)
router.post('/unfollowUser',AuthMiddleWare, userController.userUnfollow)
router.post('/block',AuthMiddleWare,userController.block)
router.post('/unblock',AuthMiddleWare,userController.unblock)

router.post('/addImage',AuthMiddleWare,userController.addImage)
router.post('/update',AuthMiddleWare,userController.update)

export default router