import express from "express";
import { protect } from "../middleware/authMiddleware.js";
const router=express.Router();
import { accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup} from "../controllers/chatControllers.js";

//End points for chat routes;
router.use(protect)
router.route('/').get(fetchChat).post(accessChat);
router.route('/group').post(createGroupChat);
router.route('/rename').put(renameGroup);
router.route('/groupremove').put(removeFromGroup);
router.route('/groupadd').put(addToGroup);

export default router