import { useNavigate } from 'react-router-dom';
import { Code2, ArrowRight, Sparkles, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = (role) => {
    navigate('/login', { state: { defaultRole: role } });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #3b82f6 0%, #ffffff 100%)' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '2rem', height: '2rem', background: '#3b82f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={20} color="white" />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#0f172a' }}>CodeLearn</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleGetStarted('student')} style={{ background: 'transparent', color: '#334155', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
              Sign In
            </button>
            <button onClick={() => handleGetStarted('student')} style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500' }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1.5rem' }}>
            Master Algorithms with
            <span style={{ background: 'linear-gradient(135deg, #0061fd, #10b981)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              {' '}AI-Powered Debugging
            </span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '48rem', margin: '0 auto 2rem' }}>
            Step through your code, get instant AI-powered insights, and understand complex algorithms with our interactive learning platform.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => handleGetStarted('student')} style={{ background: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
              Start Learning <ArrowRight size={20} />
            </button>
            <button onClick={() => handleGetStarted('teacher')} style={{ background: 'white', color: '#334155', padding: '0.75rem 1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500' }}>
              Create a Class
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          {[{ icon: <Code2 size={32} color="#3b82f6" />, title: 'Interactive IDE', desc: 'Write pseudo-code with syntax highlighting and real-time execution' },
            { icon: <Sparkles size={32} color="#3b82f6" />, title: 'AI Debugger', desc: 'Get instant explanations and debugging suggestions powered by AI' },
            { icon: <Users size={32} color="#3b82f6" />, title: 'Collaborative Learning', desc: 'Teachers can assign problems and track student progress in real-time' }
          ].map(({ icon, title, desc }) => (
            <div key={title}
              style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ width: '4rem', height: '4rem', background: '#eff6ff', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                {icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>{title}</h3>
              <p style={{ color: '#64748b', lineHeight: '1.5' }}>{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
