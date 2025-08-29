import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({

  chatId: { type: String, required: true },
  name: { type: String, required: true },

  message: { type: String, required: true }
})

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
