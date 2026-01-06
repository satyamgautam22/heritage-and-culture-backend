import express from "express";
import { register, login,getAllUsers,logout } from "../controllers/authConrtoller.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/users", auth, getAllUsers);




export default router;
