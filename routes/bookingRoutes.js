import { get } from "mongoose";
import {createBooking,getBookings,getBookingsByUserId,deleteBookingById
,createCheckoutSession,verifyPayment
} from "../controllers/guideBookingController.js"
import express from "express";
import auth from "../middleware/auth.js";

const bookingRouter=express.Router()

bookingRouter.post("/createbooking",auth,createBooking)
bookingRouter.get("/getbookings",  getBookings)
bookingRouter.get("/getbookings/:id",  getBookingsByUserId) 
bookingRouter.delete("/deletebooking/:id",  deleteBookingById)

bookingRouter.post("/create-checkout-session", createCheckoutSession);
bookingRouter.post("/verify", verifyPayment);



export default bookingRouter