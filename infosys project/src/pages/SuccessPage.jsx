import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuccessPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/register');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);
  
  const handleNewRegistration = () => {
    localStorage.removeItem('userData');
    navigate('/register');
  };
  
  if (!user) return null;
  
  return (
    <div className="container large">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Registration Successful!</h1>
        <p className="subtitle">Your account has been created and health details saved</p>
        
        <div className="user-details">
          <h3 style={{marginBottom: '15px', color: '#333'}}>Your Details</h3>
          
          <div className="detail-row">
            <span className="detail-label">Username:</span>
            <span className="detail-value">{user.username}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          
          {user.height && (
            <>
              <div className="detail-row">
                <span className="detail-label">Height:</span>
                <span className="detail-value">{user.height} cm</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Weight:</span>
                <span className="detail-value">{user.weight} kg</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Age:</span>
                <span className="detail-value">{user.age} years</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Gender:</span>
                <span className="detail-value">{user.gender}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Calories to Burn:</span>
                <span className="detail-value">{user.caloriesBurn} cal/day</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Body Fat:</span>
                <span className="detail-value">{user.bodyFat}%</span>
              </div>
              
              {user.activityLevel && (
                <div className="detail-row">
                  <span className="detail-label">Activity Level:</span>
                  <span className="detail-value">{user.activityLevel}</span>
                </div>
              )}
              
              {user.healthGoal && (
                <div className="detail-row">
                  <span className="detail-label">Health Goal:</span>
                  <span className="detail-value">{user.healthGoal}</span>
                </div>
              )}
            </>
          )}
          
          <div className="detail-row">
            <span className="detail-label">Registered:</span>
            <span className="detail-value">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <button onClick={handleNewRegistration}>Register Another User</button>
        <button onClick={() => navigate('/login')} style={{background: '#27ae60', marginTop: '10px'}}>
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;