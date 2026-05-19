import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const fallbackProfile = {
  name: 'KANISHKAR R',
  role: 'Full-Stack Developer',
  location: 'India',
  email: 'kanishkarramamoorthi@gmail.com',
  bio:
    'I build reliable web applications with polished interfaces, practical APIs, and data models that are easy to evolve.',
  links: {
    github: 'https://github.com/your-username',
    linkedin: 'https://linkedin.com/in/your-username',
    resume: '#'
  }
};

function App() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [status, setStatus] = useState('Loading portfolio...');
  const [contactState, setContactState] = useState({ sending: false, message: '' });

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const [profileRes, projectsRes, skillsRes, healthRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/projects'),
          fetch('/api/skills'),
          fetch('/api/health')
        ]);

        setProfile(await profileRes.json());
        setProjects(await projectsRes.json());
        setSkills(await skillsRes.json());

        const health = await healthRes.json();
        setStatus(
          health.database === 'connected'
            ? 'MongoDB connected'
            : 'Using starter data until MongoDB is configured'
        );
      } catch (error) {
        setStatus('Unable to reach the portfolio API');
      }
    }

    loadPortfolio();
  }, []);

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured),
    [projects]
  );

  async function handleContact(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setContactState({ sending: true, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });

      const result = await response.json();
      setContactState({ sending: false, message: result.message });

      if (response.ok) {
        event.currentTarget.reset();
      }
    } catch (error) {
      setContactState({
        sending: false,
        message: 'The message could not be sent right now.'
      });
    }
  }

  return (
    <main>
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#intro">
          {profile.name}
        </a>
        <div>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero" id="intro">
        <div className="hero-copy">
          <p className="eyebrow">{profile.location}</p>
          <h1>{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <p className="bio">{profile.bio}</p>
          <div className="actions">
            <a className="primary-action" href="#projects">
              View projects
            </a>
            <a className="secondary-action" href={`mailto:${profile.email}`}>
              Email me
            </a>
          </div>
        </div>
        <div className="profile-panel" aria-label="Portfolio summary">
          <span className="panel-label">Live status</span>
          <strong>{status}</strong>
          <div className="metric-row">
            <span>
              <b>{projects.length}</b>
              Projects
            </span>
            <span>
              <b>{skills.length}</b>
              Skills
            </span>
            <span>
              <b>{featuredProjects.length}</b>
              Featured
            </span>
          </div>
        </div>
      </section>

      <section className="section-band" id="projects">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2>Projects</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project._id || project.title}>
              <div className="project-meta">
                <span>{project.category}</span>
                <span>{project.year}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-list">
                {project.techStack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.githubUrl}>GitHub</a>
                <a href={project.liveUrl}>Live demo</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="skills-section" id="skills">
        <div className="section-heading">
          <p className="eyebrow">Toolbox</p>
          <h2>Skills</h2>
        </div>
        <div className="skills-list">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Let us build something useful.</h2>
          <p>
            Send a short note about your idea, project, or collaboration. The backend
            accepts and validates this form through Express.
          </p>
          <div className="social-links">
            <a href={profile.links.github}>GitHub</a>
            <a href={profile.links.linkedin}>LinkedIn</a>
            <a href={profile.links.resume}>Resume</a>
          </div>
        </div>
        <form onSubmit={handleContact}>
          <label>
            Name
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Message
            <textarea name="message" placeholder="Tell me about the project" required />
          </label>
          <button type="submit" disabled={contactState.sending}>
            {contactState.sending ? 'Sending...' : 'Send message'}
          </button>
          {contactState.message && <p className="form-status">{contactState.message}</p>}
        </form>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
