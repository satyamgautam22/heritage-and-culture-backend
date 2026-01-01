import mongoose from "mongoose";
 
const guideSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    email:{ type: String, required: true, },
    password:{ type: String, required: true },
    charge:{type:Number,min:0},
    age:{type:Number, required:true},
    location:{type:String ,required: true},
    gender:{type:String,required:true},
    languages:{type:Array, required:true},
    experience:{type:Number, required:true},
    bio:{type:String, maxLength:500},
    ratings:{type:Number, min:0, max:5, default:0},
    reviews:{type:[String]},
    

})

const Guide = mongoose.model("Guide", guideSchema);
export default Guide;
