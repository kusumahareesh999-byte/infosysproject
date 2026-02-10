import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8081/api' });

function OTPVerificationPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  
  useEffect(() => {
    const id = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!id || !userEmail) {
      navigate('/register');
    } else {
      setUserId(id);
      setEmail(userEmail);
    }
  }, [navigate]);
  
  useEffect(() => {
    if (timeLeft === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    
    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }
    
    if (timeLeft === 0) {
      setError('OTP expired. Please register again.');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/verify-otp', {
        userId: userId,
        otp: otpCode
      });
      
      // Navigate to health details page
      navigate('/health-details');
      
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container">
      <h1>Verify Your Email</h1>
      <p className="subtitle">
        We've sent a 6-digit OTP to<br />
        <strong>{email}</strong>
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              style={{
                width: '50px',
                height: '50px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                border: '2px solid #e1e8ed',
                borderRadius: '8px'
              }}
              autoFocus={index === 0}
            />
          ))}
        </div>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '10px',
          background: timeLeft < 60 ? '#fff3cd' : '#d4edda',
          borderRadius: '8px',
          color: timeLeft < 60 ? '#856404' : '#155724'
        }}>
          <strong>Time Remaining: {formatTime(timeLeft)}</strong>
        </div>
        
        {error && <div className="error-message" style={{textAlign: 'center', marginBottom: '15px'}}>{error}</div>}
        
        <button type="submit" disabled={loading || timeLeft === 0}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      
      <div className="link-text">
        Didn't receive OTP? <span className="link" onClick={() => navigate('/register')}>Register again</span>
      </div>
    </div>
  );
}

export default OTPVerificationPage;