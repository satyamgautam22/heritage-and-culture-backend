// models/Comment.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

CommentSchema.index({ post: 1, createdAt: -1 });

const Comment =mongoose.model("comment",CommentSchema)
export default Comment;
