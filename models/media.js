import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video", "file"], required: true },
    originalName: String,
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
