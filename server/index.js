import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase } from './db.js';
import Project from './models/Project.js';
import { sampleProjects, skills } from './data/projects.js';

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '..', 'dist');

app.use(cors());
app.use(express.json());

let databaseReady = false;

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: databaseReady ? 'connected' : 'sample-data'
  });
});

app.get('/api/profile', (_req, res) => {
  res.json({
    name: 'KANISHKAR R',
    role: 'Full-Stack Developer',
    location: 'India',
    email: process.env.CONTACT_EMAIL || 'your.email@example.com',
    bio:
      'I build reliable web applications with polished interfaces, practical APIs, and data models that are easy to evolve.',
    links: {
      github: 'https://github.com/your-username',
      linkedin: 'https://linkedin.com/in/your-username',
      resume: '#'
    }
  });
});

app.get('/api/skills', (_req, res) => {
  res.json(skills);
});

app.get('/api/projects', async (_req, res) => {
  if (!databaseReady) {
    res.json(sampleProjects);
    return;
  }

  const projects = await Project.find({}).sort({ featured: -1, year: -1, createdAt: -1 });
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  if (!databaseReady) {
    res.status(503).json({
      message: 'MongoDB is not connected. Set MONGODB_URI to add projects.'
    });
    return;
  }

  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ message: 'Name, email, and message are required.' });
    return;
  }

  console.log('Portfolio contact request:', { name, email, message });
  res.status(201).json({
    message: 'Thanks for reaching out. I will get back to you soon.'
  });
});

app.use(express.static(clientDistPath));

app.use((_req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

connectDatabase().then(async (isConnected) => {
  databaseReady = isConnected;

  if (databaseReady && (await Project.countDocuments()) === 0) {
    await Project.insertMany(sampleProjects);
    console.log('Inserted starter portfolio projects.');
  }

  app.listen(port, () => {
    console.log(`Portfolio server running on http://localhost:${port}`);
  });
});
