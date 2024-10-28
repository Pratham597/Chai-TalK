import express from 'express'
const router=express.Router()
import { protect } from '../middleware/authMiddleware.js'
import { sendMessage,allMessages } from '../controllers/messageController.js'
router.use(protect)
router.route('/').post(protect,sendMessage)
router.route('/:chatId').get(protect,allMessages)
export default router