import mongoose from "mongoose";
import Chat from "../models/chat.js";

export const getOrCreateChat = async (req, res) => {
  try {
    const myId = req.user._id || req.user.id;
    const otherId = req.params.userId;

    if (
      !mongoose.Types.ObjectId.isValid(myId) ||
      !mongoose.Types.ObjectId.isValid(otherId)
    ) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    let chat = await Chat.findOne({
      participants: { $all: [myId, otherId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [myId, otherId],
      });
    }

    return res.json(chat); // MUST return _id
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Chat error" });
  }
};
