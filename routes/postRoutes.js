import express from "express";
import { createPost, getfeed, likepost, commentonpost, getcomments } from "../controllers/postConrtoller.js";
import { register, login } from "../controllers/authConrtoller.js";

const postrouter = express.Router();

postrouter.post("/createpost",  createPost);
postrouter.get("/feed", getfeed);
postrouter.post("/:postId/like", likepost);
postrouter.post("/:postId/comment", commentonpost);
postrouter.get("/:postId/comments", getcomments);

export default postrouter;
