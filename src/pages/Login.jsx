// Import React and the hooks useState (for state management) and useEffect (for side effects)
import React, { useState, useEffect } from 'react';

// Import routing utilities:
// - useNavigate: to programmatically redirect the user to another page
// - useLocation: to read the current URL and its state
// - Link: to create navigation links without full page reload
import { useNavigate, useLocation, Link } from 'react-router-dom';

// Import the custom authentication context hook to access the login function
import { useAuth } from '../contexts/AuthContext';

// Import icons from the lucide-react icon library
import { Code2, Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

// Define the Login component as a functional component
const Login = () => {

  // State variable to hold the email input value, initialized to empty string
  const [email, setEmail] = useState('');

  // State variable to hold the password input value, initialized to empty string
  const [password, setPassword] = useState('');

  // State variable to hold the selected role, default is 'student'
  const [role, setRole] = useState('student');

  // State variable to toggle password visibility (show/hide), default is hidden
  const [showPassword, setShowPassword] = useState(false);

  // State variable to store validation error messages for each field
  const [errors, setErrors] = useState({});

  // State variable to track which fields the user has interacted with (to show errors only after touching)
  const [touched, setTouched] = useState({});

  // Destructure the login function from the authentication context
  const { login } = useAuth();

  // Hook to navigate programmatically to another route
  const navigate = useNavigate();

  // Hook to access the current location object (URL + state passed via navigation)
  const location = useLocation();

  // Side effect: runs when the component mounts or when location changes
  // If a defaultRole was passed in the navigation state, apply it to the role state
  useEffect(() => {
    if (location.state?.defaultRole) {
      setRole(location.state.defaultRole);
    }
  }, [location]); // Dependency: re-runs only when location changes


  // ─── VALIDATION FUNCTIONS ───────────────────────────────────────────────────

  // Validates the email input and returns an error message string, or '' if valid
  const validateEmail = (email) => {
    // Check if the field is empty
    if (!email) {
      return 'Email is required';
    }
    
    // Regex to validate standard email format (e.g. name@domain.com)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address (e.g., name@domain.com)';
    }
    
    // Extra check for teacher role: email should be from an educational institution
    if (role === 'teacher' && !email.includes('.edu')) {
      return 'Teacher email should be from an educational institution';
    }
    
    // No error — return empty string
    return '';
  };

  // Validates the password input and returns an error message string, or '' if valid
  const validatePassword = (password) => {
    // Check if the field is empty
    if (!password) {
      return 'Password is required';
    }
    
    // Check minimum length
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    // Check for at least one uppercase letter using regex
    const hasUpperCase = /[A-Z]/.test(password);
    // Check for at least one lowercase letter
    const hasLowerCase = /[a-z]/.test(password);
    // Check for at least one digit
    const hasNumbers = /\d/.test(password);
    // Check for at least one special character
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers)   return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character (!@#$%^&*)';
    
    // No error — return empty string
    return '';
  };


  // ─── REAL-TIME VALIDATION ────────────────────────────────────────────────────

  // Side effect: re-validates both fields every time email, password, or role changes
  useEffect(() => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    // Update the errors object with the latest validation results
    setErrors({
      email: emailError,
      password: passwordError
    });
  }, [email, password, role]); // Dependencies: re-runs when any of these change


  // ─── FORM SUBMISSION ─────────────────────────────────────────────────────────

  const handleSubmit = (e) => {
    // Prevent the default browser form submission (which would reload the page)
    e.preventDefault();
    
    // Mark both fields as touched so that errors become visible even if untouched
    setTouched({ email: true, password: true });
    
    // Re-run validation to get current errors
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    // If both fields pass validation, proceed with login
    if (!emailError && !passwordError) {
      // Call the login function from AuthContext with the entered credentials and role
      login(email, password, role);

      // Redirect to the appropriate dashboard based on the selected role
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    }
  };


  // ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

  // Returns a placeholder email string based on the selected role
  const getEmailPlaceholder = () => {
    if (role === 'teacher') {
      return "teacher@school.edu";
    } else {
      return "student@university.edu";
    }
  };

  // Calculates and returns password strength metadata (text label, color, bar width)
  const getPasswordStrength = () => {
    // If password is empty, return nothing (no strength bar shown)
    if (!password) return null;
    
    // Start with strength score of 0
    let strength = 0;

    // Add 1 point for each passing criterion
    if (password.length >= 8)       strength++; // Length
    if (/[A-Z]/.test(password))     strength++; // Uppercase
    if (/[a-z]/.test(password))     strength++; // Lowercase
    if (/[0-9]/.test(password))     strength++; // Number
    if (/[^A-Za-z0-9]/.test(password)) strength++; // Special character
    
    // Labels and colors corresponding to each strength level (index 0–4)
    const strengthText  = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const strengthColor = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#059669'];
    
    return {
      text:  strengthText[strength - 1]  || 'Very Weak',
      color: strengthColor[strength - 1] || '#ef4444',
      width: `${(strength / 5) * 100}%`  // Converts score to a percentage for the progress bar
    };
  };

  // Compute password strength once and store it for use in JSX
  const passwordStrength = getPasswordStrength();


  // ─── JSX / RENDER ────────────────────────────────────────────────────────────

  return (
    // Full-screen wrapper with a purple gradient background
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #ffffff 100%)',
    }}>

      {/* ── Navigation Bar ── */}
      <nav style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)' // Frosted glass effect on the nav
      }}>

        {/* Logo link — navigates to the home page */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: '2rem', height: '2rem',
            background: 'white', borderRadius: '0.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Code2 size={20} color="#3b82f6" />
          </div>
          <span style={{ color: 'white', fontWeight: '600', fontSize: '1.125rem' }}>CodeLearn</span>
        </Link>
        
        {/* "Back to Home" link with hover background effect */}
        <Link to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            color: 'white', textDecoration: 'none',
            padding: '0.5rem 1rem', borderRadius: '0.5rem',
            transition: 'background 0.2s'
          }}
          // Add a semi-transparent background on hover
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          // Remove the background when the mouse leaves
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </nav>

      {/* ── Login Form Container ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        // Subtract navbar height from the total viewport height
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem'
      }}>
        {/* White card containing the form */}
        <div className="card" style={{ width: '450px', maxWidth: '100%', padding: '2rem' }}>

          {/* Card Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              {/* Large code icon as a visual header */}
              <Code2 size={48} color="#3b82f6" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ color: '#6b7280' }}>Sign in to continue to CodeLearn</p>
          </div>

          {/* The form — calls handleSubmit on submission */}
          <form onSubmit={handleSubmit}>

            {/* ── Role Selection (Radio Buttons) ── */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>I am a...</label>
              <div style={{ display: 'flex', gap: '1rem' }}>

                {/* Student radio option */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="student"
                    checked={role === 'student'} // Selected if current role is 'student'
                    onChange={(e) => {
                      setRole(e.target.value); // Update role state
                      setEmail('');            // Reset email when switching roles
                      setErrors({});           // Clear errors
                    }}
                  />
                  Student
                </label>

                {/* Teacher radio option */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="teacher"
                    checked={role === 'teacher'} // Selected if current role is 'teacher'
                    onChange={(e) => {
                      setRole(e.target.value);
                      setEmail('');
                      setErrors({});
                    }}
                  />
                  Teacher
                </label>
              </div>
            </div>

            {/* ── Email Field ── */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email <span style={{ color: '#ef4444' }}>*</span> {/* Required field indicator */}
              </label>

              {/* Wrapper div for positioning the icon and validation icons inside the input */}
              <div style={{ position: 'relative' }}>

                {/* Mail icon absolutely positioned inside the input on the left */}
                <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />

                <input
                  type="email"
                  value={email}                          // Controlled input bound to email state
                  onChange={(e) => setEmail(e.target.value)} // Update state on every keystroke
                  onBlur={() => setTouched({ ...touched, email: true })} // Mark email as touched when user leaves the field
                  placeholder={getEmailPlaceholder()}    // Dynamic placeholder based on role
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',  // Left padding leaves room for the mail icon
                    border: `2px solid ${
                      touched.email && errors.email       // Red border if touched and has error
                        ? '#ef4444' 
                        : touched.email && !errors.email && email  // Green border if touched, valid, and not empty
                        ? '#10b981'
                        : '#d1d5db'                       // Default gray border
                    }`,
                    borderRadius: '0.5rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: 'white'
                  }}
                  // On focus, turn border blue if there is no error
                  onFocus={(e) => {
                    if (!errors.email) e.target.style.borderColor = '#3b82f6';
                  }}
                />

                {/* Green checkmark icon — shown only when email is touched, non-empty, and valid */}
                {touched.email && email && !errors.email && (
                  <CheckCircle size={18} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                )}

                {/* Red X icon — shown only when email is touched and has a validation error */}
                {touched.email && errors.email && (
                  <XCircle size={18} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} />
                )}
              </div>

              {/* Error message shown below the input when email is touched and invalid */}
              {touched.email && errors.email && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* ── Password Field ── */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>

              <div style={{ position: 'relative' }}>
                {/* Lock icon absolutely positioned on the left */}
                <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />

                <input
                  type={showPassword ? 'text' : 'password'} // Toggle between visible text and hidden password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })} // Mark password as touched on blur
                  placeholder="Enter your password"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: `2px solid ${
                      touched.password && errors.password
                        ? '#ef4444'
                        : touched.password && !errors.password && password
                        ? '#10b981'
                        : '#d1d5db'
                    }`,
                    borderRadius: '0.5rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: 'white',
                    paddingRight: '2.5rem' // Right padding leaves room for the eye toggle button
                  }}
                />

                {/* Eye/EyeOff button to toggle password visibility */}
                <button
                  type="button"             // Prevents this button from submitting the form
                  onClick={() => setShowPassword(!showPassword)} // Toggle the showPassword boolean
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af'
                  }}
                >
                  {/* Show EyeOff icon when password is visible, Eye icon when hidden */}
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {/* Green checkmark — shown when password is touched, non-empty, and valid */}
                {touched.password && password && !errors.password && (
                  <CheckCircle size={18} style={{ position: 'absolute', right: '2.5rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                )}
              </div>
              
              {/* ── Password Strength Bar ── shown only when password is non-empty and valid */}
              {password && !errors.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  {/* Gray background track for the strength bar */}
                  <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                    {/* Colored fill whose width and color reflect password strength */}
                    <div style={{
                      width: passwordStrength?.width || '0%',
                      height: '100%',
                      background: passwordStrength?.color,
                      transition: 'width 0.3s' // Animate the bar width change
                    }} />
                  </div>
                  {/* Text label showing the current strength level */}
                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem',
                    fontSize: '0.7rem', color: passwordStrength?.color
                  }}>
                    <span>Password strength: {passwordStrength?.text}</span>
                  </div>
                </div>
              )}
              
              {/* Password error message — shown only when touched and there's an error */}
              {touched.password && errors.password && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.password}
                </div>
              )}
            </div>

            {/* ── Password Requirements Checklist ── */}
            <div style={{ 
              marginBottom: '1.5rem', padding: '0.75rem',
              background: '#f9fafb', borderRadius: '0.5rem', fontSize: '0.75rem'
            }}>
              <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Password requirements:</div>

              {/* 2-column grid of requirement checks */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>

                {/* Each row: green checkmark if condition is met, gray X if not */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {password.length >= 8
                    ? <CheckCircle size={12} color="#10b981" />
                    : <XCircle size={12} color="#9ca3af" />}
                  <span>At least 8 characters</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {/[A-Z]/.test(password)
                    ? <CheckCircle size={12} color="#10b981" />
                    : <XCircle size={12} color="#9ca3af" />}
                  <span>Uppercase letter</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {/[a-z]/.test(password)
                    ? <CheckCircle size={12} color="#10b981" />
                    : <XCircle size={12} color="#9ca3af" />}
                  <span>Lowercase letter</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {/\d/.test(password)
                    ? <CheckCircle size={12} color="#10b981" />
                    : <XCircle size={12} color="#9ca3af" />}
                  <span>Number</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {/[!@#$%^&*(),.?":{}|<>]/.test(password)
                    ? <CheckCircle size={12} color="#10b981" />
                    : <XCircle size={12} color="#9ca3af" />}
                  <span>Special character</span>
                </div>
              </div>
            </div>

            {/* ── Submit Button ── */}
            <button
              type="submit"
              // Disabled if either field has an error OR if either field is empty
              disabled={!!errors.email || !!errors.password || !email || !password}
              className="btn-primary"
              style={{ 
                width: '100%', padding: '0.75rem', fontSize: '1rem',
                // Visually dim the button when disabled
                opacity: (errors.email || errors.password || !email || !password) ? 0.5 : 1,
                // Show not-allowed cursor when disabled
                cursor: (errors.email || errors.password || !email || !password) ? 'not-allowed' : 'pointer'
              }}
            >
              Sign In
            </button>
          </form>

          {/* ── Demo Credentials Notice ── */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            <p>Demo Credentials:</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
              <strong>Student:</strong> student@university.edu / Student@123<br />
              <strong>Teacher:</strong> teacher@school.edu / Teacher@123<br />
              <em>(Use any email format that passes validation)</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the Login component so it can be imported and used in other files (e.g., App.jsx router)
export default Login;