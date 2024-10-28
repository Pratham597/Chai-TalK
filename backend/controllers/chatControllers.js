import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";
import { populate } from "dotenv";

// Create chat if not exist else send the chat between users.
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId not found");
    return res.sendStatus(400);
  }

  try {
    let isChat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name profilePic email" },
      });

    if (isChat) return res.send(isChat);
    else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const createdChat = new Chat(chatData);
      await createdChat.save();
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return res.status(200).send(FullChat);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const fetchChat = asyncHandler(async (req, res, next) => {
  try {
    let user = req.user._id;
    let chatArr = await Chat.find({ users: { $elemMatch: { $eq: user } } })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name profilePic email" },
      })
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });
    return res.status(200).send(chatArr);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  let userArr = req.body.users;
  if (userArr.length < 2) {
    return res.status(400).send({
      message: "Unable to create group with one or less than one user.",
    });
  }

  userArr.push(req.user._id);
  try {
    const chat = new Chat({
      chatName: req.body.name,
      isGroupChat: true,
      users: userArr,
      groupAdmin: req.user._id,
    });
    await chat.save();
    const result = await Chat.findById(chat._id)
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name profilePic email" },
      })
      .populate("groupAdmin", "-password");
    return res.status(200).json(result);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (chat.isGroupChat && chat.groupAdmin._id.equals(req.user._id)) {
      chat.chatName = chatName;
      await chat.save();
      const data = await Chat.findById(chat._id)
        .populate("users", "-password")
        .populate({
          path: "latestMessage",
          populate: { path: "sender", select: "name profilePic email" },
        })
        .populate("groupAdmin", "-password");

      return res.status(200).json(data);
    } else {
      return res.status(403).json({ message: "Unauthorized User!" });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name profilePic email" },
      })
      .populate("groupAdmin", "-password");
    return res.status(200).json(chat);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name profilePic email" },
      })
      .populate("groupAdmin", "-password");
    return res.status(200).json(chat);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
export {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
