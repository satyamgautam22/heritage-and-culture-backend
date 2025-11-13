import mongoose from "mongoose";

const guideBookingSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    mobile:{type:String, required:true},
    trips:{type:String},
    budget:{type:Number},
    location:{type:String},
    date:{type:Date},
    time:{type:String},
    guideId:{type:mongoose.Schema.Types.ObjectId, ref:"Guide"},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
     paymentStatus: { type: String, default: "pending" },
}, {timestamps:true});



const GuideBooking = mongoose.model("GuideBooking", guideBookingSchema);

export default GuideBooking