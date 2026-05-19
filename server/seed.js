import 'dotenv/config';
import mongoose from 'mongoose';
import Project from './models/Project.js';
import { sampleProjects } from './data/projects.js';

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required to seed the database.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  await Project.deleteMany({});
  await Project.insertMany(sampleProjects);
  await mongoose.disconnect();

  console.log(`Seeded ${sampleProjects.length} projects.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
