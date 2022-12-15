import { Router } from "express";
import * as postController from '../controllers/post.controller.js'
import bodyParser from 'body-parser'
const parser = bodyParser.json()
const router = Router()

router.post('/addPost', parser, postController.postAdd)
router.post('/deletePost', parser, postController.postDelete)

export default router