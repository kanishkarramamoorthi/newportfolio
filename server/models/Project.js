import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    techStack: {
      type: [String],
      default: []
    },
    githubUrl: {
      type: String,
      trim: true
    },
    liveUrl: {
      type: String,
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    year: {
      type: Number,
      default: new Date().getFullYear()
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Project', projectSchema);
