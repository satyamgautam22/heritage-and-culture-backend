import express from "express";
import {register,login,getGuidesByLocation} from "../controllers/guideController.js";


const guideRouter =express.Router();

guideRouter.post("/register",register)
guideRouter.post("/login",login)
guideRouter.get("/:location", getGuidesByLocation);



export default guideRouter;
