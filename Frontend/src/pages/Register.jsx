import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import axios from 'axios';
import '../styles/theme.css';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters long');
      setIsLoading(false);
      return;
    }

          axios.post("http://localhost:3000/api/auth/register", {
            email: formData.email,
            fullname: {
                firstname: formData.firstname,
                lastname: formData.lastname
            },
            password: formData.password
        }, {
            withCredentials: true
        }).then((res) => {
            console.log(res);
            navigate("/");
        }).catch((err) => {
            console.error(err);
            alert('Registration failed (placeholder)');
        })
        .finally(() => {
            setIsLoading(false);
        });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Please fill in your information</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="name-row">
            <div className="input-group half-width">
              <User className="input-icon" size={18} />
              <input
                type="text"
                name="firstname"
                placeholder="First name"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group half-width">
              <User className="input-icon" size={18} />
              <input
                type="text"
                name="lastname"
                placeholder="Last name"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password (min 4 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <button 
            type="button"
            className="link-button"
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;