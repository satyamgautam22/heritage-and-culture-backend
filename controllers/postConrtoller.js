import Post from "../models/post.js";
import Comment from "../models/comment.js";
import ImageKit from "imagekit";
import { configDotenv } from "dotenv";
configDotenv()

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const createPost = async (req, res) => {
  try {
    const { filePath, fileId } = req.file || {};
    const caption = req.body.caption || "";

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const post = new Post({
      author: req.user._id,
      caption,
      imageUrl: filePath || req.file.url || req.file.path,
      imageFileId: fileId || req.file.fileId,
    });

    await post.save();

    res.status(201).json({ success: true, post });
  }catch (err) {
  console.error("❌ Error in createPost:", err.message);
  console.error(err.stack);
  res.status(500).json({ error: err.message  });;
  }
};

export const getfeed =async (req,res)=>{
    try{
     const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const cursor = req.query.cursor ? new Date(req.query.cursor) : null;

    const query = cursor ? { createdAt: { $lt: cursor } } : {};
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1) 
      .populate("author", "name avatar"); 


    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();

    res.json({
      posts,
      nextCursor: posts.length ? posts[posts.length - 1].createdAt.toISOString() : null,
      hasMore
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load feed" });
  }
}

export const likepost =async (req,res)=>{
     try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userIdStr = req.user._id.toString();
    const liked = post.likes.some(id => id.toString() === userIdStr);
    if (liked) {
      post.likes = post.likes.filter(id => id.toString() !== userIdStr);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();

    res.json({ success: true, liked: !liked, likesCount: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not toggle like" });
  }
}

export const commentonpost =async(req,res)=>{
     try {
    const { postId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: "Comment cannot be empty" });

    const comment = new Comment({
      post: postId,
      author: req.user._id,
      text: text.trim()
    });
    await comment.save();

   
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.status(201).json({ success: true, comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add comment" });
  }
}
export const getcomments= async(req,res)=>{
     try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "name avatar");
    res.json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load comments" });
  }
}
export const deletepost =async(req,res)=>{
  try{
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });

    }
    await Post.findByIdAndDelete(postId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete post" });
  }

}