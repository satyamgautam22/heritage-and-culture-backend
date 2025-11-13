import Chat from "../models/post.js";
import mongoose from "mongoose";

export const createChat = async(req, res)=>{

  try{
    const { name, messages } = req.body;

    //generating chatId
    const chatId = new mongoose.Types.ObjectId();

    // Create a new chat
    const chat = new Chat({ chatId, name, messages });

    await chat.save();

    res.status(201).json({ message: "Chat created successfully", chat });
  }

  catch(err){
    console.error("Error creating chat:", err);
    res.status(500).json({ message: "Internal server error",error:err.message });
  }
}




//get all chat
export const getChat = async(req, res)=>{

  try{
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Chats retrieved successfully", chats });
  }

  catch(err){
    console.error("Error retrieving chats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteChat = async(req, res)=>{

  try{
    const { chatId } = req.params;

    // Find and delete the chat
    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully", chat });
  }

  catch(err){
    console.error("Error deleting chat:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
