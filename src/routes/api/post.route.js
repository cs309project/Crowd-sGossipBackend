import { Router } from "express";
import * as postController from '../../controllers/post.controller.js'
const router = Router()
import AuthMiddleWare from "../../middleWare/authMiddleware.js"

router.post('/update',AuthMiddleWare, postController.postUpdate)
router.post('/add',AuthMiddleWare, postController.postAdd)
router.post('/delete/:id',AuthMiddleWare, postController.postDelete)
router.get('/:id',AuthMiddleWare, postController.postGet)
router.post('/addComment',AuthMiddleWare, postController.postAddComment)
router.post('/updateComment',AuthMiddleWare, postController.postUpdateComment)
router.post('/addDownVoter',AuthMiddleWare, postController.postAddDownVoter)
router.post('/removeDownVoter',AuthMiddleWare, postController.postRemoveDownVoter)
router.get('/getDownVoters/:id',AuthMiddleWare, postController.postListDownVoters)
router.post('/deleteComment',AuthMiddleWare, postController.postDeleteComment)
router.post('/addUpVote',AuthMiddleWare, postController.postAddUpVote)
router.post('/removeUpVote',AuthMiddleWare, postController.postRemoveUpVote)
router.get('/getUpVoters/:id',AuthMiddleWare, postController.postGetUpVoters)
export default router