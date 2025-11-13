import dotenv from "dotenv";
import ImageKit from "imagekit";
import Media from "../models/media.js"; // ✅ new model for DB storage

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Upload Image
export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No image provided" });

    const uploadedImage = await imagekit.upload({
      file: file.buffer,
      fileName: `z`,
      folder: "images",
    });

    // Save in DB
    await Media.create({
      url: uploadedImage.url,
      type: "image",
      originalName: file.originalname,
    });

    res.json({ message: "Image uploaded successfully", imageUrl: uploadedImage.url });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};

// Upload Video
export const uploadVideo = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No video provided" });
    if (!file.mimetype.startsWith("video/")) {
      return res.status(400).json({ message: "Only video files are allowed" });
    }

    const uploadedVideo = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "videos",
    });

    // Save in DB
    await Media.create({
      url: uploadedVideo.url,
      type: "video",
      originalName: file.originalname,
    });

    res.json({ message: "Video uploaded successfully", videoUrl: uploadedVideo.url });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Video upload failed", error: error.message });
  }
};

// Upload File
export const fileUpload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file provided" });

    const base64File = file.buffer.toString("base64");
    const uploadedFile = await imagekit.upload({
      file: base64File,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "files",
    });

    // Save in DB
    await Media.create({
      url: uploadedFile.url,
      type: "file",
      originalName: file.originalname,
    });

    res.json({ message: "File uploaded successfully", fileUrl: uploadedFile.url });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
};

// Fetch from DB (instead of only ImageKit)
export const fetchMedia = async (req, res) => {
  try {
    const { type = "all", limit = 10 } = req.query;

    const query = type === "all" ? {} : { type };
    const media = await Media.find(query).sort({ createdAt: -1 }).limit(Number(limit));

    res.json(media);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
};
