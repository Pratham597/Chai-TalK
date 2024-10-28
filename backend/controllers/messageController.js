import asynchandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

const sendMessage = asynchandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    return res.status(400).json({ message: "Required fields are empty" });
  }
  const data = { sender: req.user._id, content, chat: chatId };
  try {
    let message = new Message(data);
    await message.save();
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePic email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    return res.status(200).json(message);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const allMessages = asynchandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name profilePic email")
      .populate("chat");
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export { sendMessage, allMessages };
