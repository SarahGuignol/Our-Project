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
  const handleGetStarted = (role) => {
    navigate('/login', { state: { defaultRole: role } });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #3b82f6 0%, #ffffff 100%)',}}>
      {/* Navigation */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              background: '#3b82f6',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Code2 size={20} color="white" />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#0f172a' }}>
              CodeLearn
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => handleGetStarted('student')}
              style={{
                background: 'transparent',
                color: '#334155',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => handleGetStarted('student')}
              style={{
                background: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
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
      {/* Hero Section */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: '1.5rem'
          }}>
            Master Algorithms with
            <span style={{
              background: 'linear-gradient(135deg, #0061fd, #10b981)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              {' '}AI-Powered Debugging
            </span>          
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#475569',
            maxWidth: '48rem',
            margin: '0 auto 2rem'
          }}>
            Step through your code, get instant AI-powered insights, and understand complex algorithms
            with our interactive learning platform.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleGetStarted('student')}
              style={{
                background: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '500'
              }}
            >
              Start Learning <ArrowRight size={20} />
            </button>
            <button
              onClick={() => handleGetStarted('teacher')}
              style={{
                background: 'white',
                color: '#334155',
                padding: '0.75rem 1.5rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
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
        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {/* Feature 1 */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: '#eff6ff',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Code2 size={32} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>
              Interactive IDE
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.5' }}>
              Write pseudo-code with syntax highlighting and real-time execution
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: '#eff6ff',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Sparkles size={32} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>
              AI Debugger
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.5' }}>
              Get instant explanations and debugging suggestions powered by AI
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: '#eff6ff',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Users size={32} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>
              Collaborative Learning
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.5' }}>
              Teachers can assign problems and track student progress in real-time
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; // exports the component so other files can import and use it
export default Home;
