import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8081/api' });

function LoginPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await api.post('/login', formData);
      
      // Save user data and navigate to success page
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      navigate('/success');
      
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };
  
  return (
    <div className="container">
      <h1>Welcome Back</h1>
      <p className="subtitle">Login to your WellNest account</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username or Email</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            className={error ? 'error' : ''}
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={error ? 'error' : ''}
          />
          {error && <span className="error-message">{error}</span>}
        </div>
        
        <button type="submit">Login</button>
      </form>
      
      <div className="link-text">
        Don't have an account? <span className="link" onClick={() => navigate('/register')}>Register here</span>
      </div>
    </div>
  );
}

export default LoginPage;