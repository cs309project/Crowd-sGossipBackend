import { Router } from "express";
import * as postController from '../controllers/post.controller.js'
const router = Router()

router.post('/updatePost', postController.postUpdate)
router.post('/addPost', postController.postAdd)
router.post('/deletePost', postController.postDelete)
router.get('/getPostById', postController.postGet)
export default router