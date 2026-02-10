import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8081/api' });

function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [checking, setChecking] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const checkUsername = async (username) => {
    if (username.length < 3) return;
    
    setChecking(prev => ({ ...prev, username: true }));
    try {
      const res = await api.get(`/check-username/${username}`);
      if (!res.data.available) {
        setErrors(prev => ({ ...prev, username: 'Username already taken' }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setChecking(prev => ({ ...prev, username: false }));
    }
  };
  
  const checkEmail = async (email) => {
    if (!email.includes('@')) return;
    
    setChecking(prev => ({ ...prev, email: true }));
    try {
      const res = await api.get(`/check-email/${email}`);
      if (!res.data.available) {
        setErrors(prev => ({ ...prev, email: 'Email already registered' }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setChecking(prev => ({ ...prev, email: false }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const res = await api.post('/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // Save userId and email, navigate to OTP verification
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('userEmail', res.data.email);
      
      navigate('/verify-otp');
      
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.error) {
        alert("Error: " + error.response.data.error);
      } else if (error.message) {
        alert("Error: " + error.message);
      } else {
        alert('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <h1>Create Account</h1>
      <p className="subtitle">Join WellNest - Your Health Companion</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={(e) => checkUsername(e.target.value)}
            className={errors.username ? 'error' : ''}
            disabled={loading}
          />
          {checking.username && <span className="checking">Checking availability...</span>}
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={(e) => checkEmail(e.target.value)}
            className={errors.email ? 'error' : ''}
            disabled={loading}
          />
          {checking.email && <span className="checking">Checking availability...</span>}
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            disabled={loading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            disabled={loading}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Continue to Verify Email'}
        </button>
      </form>
      
      <div className="link-text">
        Already have an account? <span className="link" onClick={() => navigate('/login')}>Login here</span>
      </div>
    </div>
  );
}

export default RegisterPage;