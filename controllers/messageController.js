import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
