import Guide from "../models/guide.js";
import bcrypt from "bcryptjs";

//registeration 
export const register =async(req,res)=>{
try{
    const{name,email,password ,location, gender,age,languages,experience}=req.body;
    if(!name || !email || !password  || !location || !gender|| !age || !languages || !experience){
        return res.status(400).json({message:"All fields are required"});
    }
    const ifexist = await Guide.findOne({ email });
    if(ifexist){
        return res.status(401).json({message:"User already exists"});
    }
    const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);
    const guide =await Guide.create({
        name,
        email,
        password: hashedPassword,
        location,
        gender,
        age,
        languages,
        experience
    });
    res.status(200).json({message:"Guide registered successfully"});



}
catch(error){
    res.status(500).json({message:"Server error"+ error.message});

}
}
//login
export const login =async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const guide = await Guide.findOne({ email });
        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }
        const isMatch = await bcrypt.compare(password, guide.password);

       if (!isMatch) {
           return res.status(401).json({ message: "Invalid credentials" });
       }
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" + error.message });
    }
};
export const getGuidesByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    const guides = await Guide.find({
      location: { $regex: new RegExp(location, "i") }
    });

    if (guides.length === 0) {
      return res.status(404).json({ message: "No guides found in this location" });
    }

    return res.status(200).json({
      message: "Guides fetched successfully",
      guides,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error: " + err.message,
    });
  }
};
