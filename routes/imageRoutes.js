// routes/uploadRoute.js
import express from "express";
import multer from "multer";
import {fetchMedia , uploadImage,uploadVideo ,fileUpload} from "../controllers/usersdata.js";



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/uploadimage", upload.single("image"), uploadImage);
router.post("/uploadvideo", upload.single("video"), uploadVideo);
router.post("/fileUpload", upload.single("file"), fileUpload);
router.get("/fetch", fetchMedia);


export default router;
