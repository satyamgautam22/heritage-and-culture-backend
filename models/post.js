import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  caption: { type: String, trim: true },
  imageUrl: { type: String, required: true },
  imageFileId: { type: String }, 
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

PostSchema.index({ createdAt: -1 });

const Post =mongoose.model("post",PostSchema)
export default Post
