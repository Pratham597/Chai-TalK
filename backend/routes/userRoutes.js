import express from 'express'
import { authUser } from '../controllers/userController.js';
import { verifyEmail,registerUser ,allUsers} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
//instance of router.
const router=express.Router();

router.route('/').post(registerUser).get(protect,allUsers);
router.route('/verifyEmail').post(verifyEmail)
router.post('/login',authUser);

export default router;