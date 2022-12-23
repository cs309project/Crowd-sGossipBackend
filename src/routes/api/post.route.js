import { Router } from "express";
import * as postController from '../../controllers/post.controller.js'
const router = Router()

router.post('/update', postController.postUpdate)
router.post('/add', postController.postAdd)
router.post('/delete/:id', postController.postDelete)
router.get('/:id', postController.postGet)
router.post('/addComment', postController.postAddComment)
router.post('/updateComment', postController.postUpdateComment)
router.post('/addDownVoter', postController.postAddDownVoter)
router.post('/removeDownVoter', postController.postRemoveDownVoter)
router.get('/getDownVoters', postController.postListDownVoters)
router.post('/deleteComment', postController.postDeleteComment)
router.post('/addUpVote', postController.postAddUpVote)
router.post('/removeUpVote', postController.postRemoveUpVote)
router.get('/getUpVoters', postController.postGetUpVoters)
export default router