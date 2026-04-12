import { useNavigate } from 'react-router-dom'; // imports the navigation hook from React Router
import { Code2, BookOpen, Users, ArrowRight, Sparkles } from 'lucide-react'; // imports icons from lucide-react library

const Home = () => { // defines the Home component as an arrow function
  const navigate = useNavigate(); // creates a navigate function to redirect to other pages

  const handleGetStarted = (role) => { // function that handles navigation when a button is clicked
    console.log("selected Role:", role); // prints the selected role in the browser console (for debugging)
    navigate('/login', { state: { defaultRole: role } }); // redirects to the login page and passes the role as state
  };

  return (
    <div className="landing-container"> {/* main wrapper div with full page background */}
      <nav className="landing-nav"> {/* top navigation bar */}
        <div className="nav-content"> {/* inner wrapper to center and space nav items */}
          <div className="logo-container"> {/* groups the logo icon and text together */}
            <div className="logo-icon"> {/* colored square box behind the logo icon */}
              <Code2 size={20} color="white" /> {/* code icon in white, size 20px */}
            </div>
            <span className="logo-text">CodeLearn Platform</span> {/* platform name next to the logo */}
          </div>
          <div className="nav-buttons"> {/* groups the nav buttons on the right */}
            <button onClick={() => handleGetStarted('student')} className="btn-ghost"> {/* transparent Sign In button */}
              Sign In
            </button>
            <button onClick={() => handleGetStarted('student')} className="btn-primary-landing"> {/* white Get Started button */}
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="landing-main"> {/* main content area below the navbar */}
        <div className="hero-section"> {/* centered hero section with title and buttons */}
          <h1 className="hero-title"> {/* large main title */}
            Master Algorithms with
            <span className="gradient-text"> AI-Powered Debugging</span> {/* highlighted gradient part of the title */}
          </h1>
          <p className="hero-description"> {/* subtitle paragraph below the title */}
            Step through your code, get instant AI-powered insights, and understand complex algorithms
            with our interactive learning platform.
          </p>
          <div className="hero-buttons"> {/* wrapper for the two action buttons */}
            <button onClick={() => handleGetStarted('student')} className="btn-primary-landing btn-large"> {/* Start Learning button for students */}
              Start Learning <ArrowRight size={20} className="ml-2" /> {/* arrow icon next to button text */}
            </button>
            <button onClick={() => handleGetStarted('teacher')} className="btn-outline-landing btn-large"> {/* Create a Class button for teachers */}
              Create a Class
            </button>
          </div>
        </div>

        <div className="features-grid"> {/* grid layout that holds the 3 feature cards */}
          <div className="feature-card"> {/* first feature card */}
            <div className="feature-icon"><Code2 size={32} /></div> {/* icon for the IDE feature */}
            <h3 className="feature-title">Interactive IDE</h3> {/* card title */}
            <p className="feature-description">Write pseudo-code with syntax highlighting and real-time execution</p> {/* card description */}
          </div>
          <div className="feature-card"> {/* second feature card */}
            <div className="feature-icon"><Sparkles size={32} /></div> {/* icon for the AI debugger feature */}
            <h3 className="feature-title">AI Debugger</h3> {/* card title */}
            <p className="feature-description">Get instant explanations and debugging suggestions powered by AI</p> {/* card description */}
          </div>
          <div className="feature-card"> {/* third feature card */}
            <div className="feature-icon"><Users size={32} /></div> {/* icon for the collaborative learning feature */}
            <h3 className="feature-title">Collaborative Learning</h3> {/* card title */}
            <p className="feature-description">Teachers can assign problems and track student progress</p> {/* card description */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; // exports the component so other files can import and use it