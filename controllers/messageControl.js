import axios from "axios";
import openai from "../config/openai.js";
import Chat from "../models/chat.js";
import User from "../models/Users.js";
import mongoose from "mongoose";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ---------------- TEXT MESSAGE -----------------
export const textMessageController = async (req, res) => {
  try {
    const { chatId, userId, prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let chat = await Chat.findById(chatId);

    // If no chat found, create one
    if (!chat) {
      chat = new Chat({ _id: chatId || new mongoose.Types.ObjectId(), prompt: [] });
    }

    // Push user message
    chat.prompt.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false });

    // Call OpenAI
    const { choices } = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or whichever model is actually available
      messages: [{ role: "user", content: prompt }],
    });

    const reply = {
      role: "assistant",
      content: choices[0].message.content,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.prompt.push(reply);

    await chat.save();

    if (userId) {
      await User.updateOne({ _id: userId }, { $set: { lastMessage: reply } });
    }

    res.status(200).json({ message: "Text message sent successfully", reply, chatId: chat._id });
  } catch (err) {
    console.error("Error sending text message:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ---------------- IMAGE MESSAGE -----------------
export const imageMessageController = async (req, res) => {
  try {
    const { chatId, userId, imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    let chat = await Chat.findById(chatId);
    if (!chat) {
      chat = new Chat({ _id: chatId || new mongoose.Types.ObjectId(), prompt: [] });
    }

    chat.prompt.push({ role: "user", content: imageUrl, timestamp: Date.now(), isImage: true });

    // Encode and fetch
    const encodedPrompt = encodeURIComponent(imageUrl);
    const generateImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    const response = await axios.get(generateImageUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `quickgpt-${Date.now()}.png`,
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
    };

    chat.prompt.push(reply);
    await chat.save();

    if (userId) {
      await User.updateOne({ _id: userId }, { $set: { lastMessage: reply } });
    }

    res.status(200).json({ message: "Image message sent successfully", reply, chatId: chat._id });
  } catch (err) {
    console.error("Error sending image message:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
