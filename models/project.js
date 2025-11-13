import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"]
      
      
    },
    description: {
      type: String,
     
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
