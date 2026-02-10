import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8081/api' });

function HealthDetailsPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: '',
    healthGoal: '',
    caloriesBurn: '',
    bodyFat: ''
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) {
      navigate('/register');
    } else {
      setUserId(id);
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.height) newErrors.height = 'Height is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.caloriesBurn) newErrors.caloriesBurn = 'Calories to burn is required';
    if (!formData.bodyFat) newErrors.bodyFat = 'Body fat percentage is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      const res = await api.put(`/health-details/${userId}`, formData);
      
      // Save complete user data
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      localStorage.removeItem('userId'); // Clean up
      
      navigate('/success');
      
    } catch (error) {
      alert('Failed to save health details. Please try again.');
    }
  };
  
  return (
    <div className="container large">
      <h1>Health Details</h1>
      <p className="subtitle">Tell us about yourself to personalize your experience</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Height (cm) *</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className={errors.height ? 'error' : ''}
            />
            {errors.height && <span className="error-message">{errors.height}</span>}
          </div>
          
          <div className="form-group">
            <label>Weight (kg) *</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className={errors.weight ? 'error' : ''}
            />
            {errors.weight && <span className="error-message">{errors.weight}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Age *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? 'error' : ''}
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>
          
          <div className="form-group">
            <label>Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? 'error' : ''}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Calories Need to Burn (per day) *</label>
            <input
              type="number"
              name="caloriesBurn"
              value={formData.caloriesBurn}
              onChange={handleChange}
              placeholder="e.g., 2000"
              className={errors.caloriesBurn ? 'error' : ''}
            />
            {errors.caloriesBurn && <span className="error-message">{errors.caloriesBurn}</span>}
          </div>
          
          <div className="form-group">
            <label>Body Fat (%) *</label>
            <input
              type="number"
              step="0.1"
              name="bodyFat"
              value={formData.bodyFat}
              onChange={handleChange}
              placeholder="e.g., 15.5"
              className={errors.bodyFat ? 'error' : ''}
            />
            {errors.bodyFat && <span className="error-message">{errors.bodyFat}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label>Activity Level</label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
          >
            <option value="">Select Activity Level</option>
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Lightly Active (1-3 days/week)</option>
            <option value="moderate">Moderately Active (3-5 days/week)</option>
            <option value="very">Very Active (6-7 days/week)</option>
            <option value="extra">Extra Active (athlete level)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Health Goal</label>
          <select
            name="healthGoal"
            value={formData.healthGoal}
            onChange={handleChange}
          >
            <option value="">Select Health Goal</option>
            <option value="lose-weight">Lose Weight</option>
            <option value="gain-muscle">Gain Muscle</option>
            <option value="maintain">Maintain Weight</option>
            <option value="improve-fitness">Improve Fitness</option>
            <option value="general-health">General Health</option>
          </select>
        </div>
        
        <button type="submit">Complete Registration</button>
      </form>
    </div>
  );
}

export default HealthDetailsPage;