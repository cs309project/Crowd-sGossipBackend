import userRouter from './api/user.route.js';
import postRouter from "./api/post.route.js";
import { Router } from "express";

const router = Router();

router.use('/users',userRouter)
router.use('/posts',postRouter)

export default router;