import mongoose from "mongoose";
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    takenDate: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    pdf: {
      type: String,
      required: true, // Path to the uploaded PDF
    },
    completed: {
      type: Boolean,
      default: false, // Initially, projects are incomplete
    },
    completionLink: {
      type: String,
      default: null, // Make sure this matches the field name used in the controller
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);
const Project = mongoose.model('Project', projectSchema);

export default Project;