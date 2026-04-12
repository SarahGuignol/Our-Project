import { useNavigate } from 'react-router-dom';
import { Code2, BookOpen, Users, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = (role) => {
    console.log("selected Role:", role); 
    navigate('/login', { state: { defaultRole: role } });
  };

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo-container">
            <div className="logo-icon">
              <Code2 size={20} color="white" />
            </div>
            <span className="logo-text">CodeLearn Platform</span>
          </div>
          <div className="nav-buttons">
            <button onClick={() => handleGetStarted('student')} className="btn-ghost">
              Sign In
            </button>
            <button onClick={() => handleGetStarted('student')} className="btn-primary-landing">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="landing-main">
        <div className="hero-section">
          <h1 className="hero-title">
            Master Algorithms with
            <span className="gradient-text"> AI-Powered Debugging</span>
          </h1>
          <p className="hero-description">
            Step through your code, get instant AI-powered insights, and understand complex algorithms 
            with our interactive learning platform.
          </p>
          <div className="hero-buttons">
            <button onClick={() => handleGetStarted('student')} className="btn-primary-landing btn-large">
              Start Learning <ArrowRight size={20} className="ml-2" />
            </button>
            <button onClick={() => handleGetStarted('teacher')} className="btn-outline-landing btn-large">
              Create a Class
            </button>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Code2 size={32} /></div>
            <h3 className="feature-title">Interactive IDE</h3>
            <p className="feature-description">Write pseudo-code with syntax highlighting and real-time execution</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Sparkles size={32} /></div>
            <h3 className="feature-title">AI Debugger</h3>
            <p className="feature-description">Get instant explanations and debugging suggestions powered by AI</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Users size={32} /></div>
            <h3 className="feature-title">Collaborative Learning</h3>
            <p className="feature-description">Teachers can assign problems and track student progress</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 