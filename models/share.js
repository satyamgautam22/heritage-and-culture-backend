import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    shareId: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    
  },
  { timestamps: true }
);

export default mongoose.model("Share", shareSchema);
