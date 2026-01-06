import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: String,
  },
  { timestamps: true }
);

export default mongoose.models.Chat ||
  mongoose.model("Chat", chatSchema);
