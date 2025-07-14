import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      alert(res.data.message || 'Registration successful! Please check your email for OTP.');
      setUserId(res.data.userId); 
      setShowOtpInput(true);  

      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        userId,
        otp,
      });

      alert(res.data.message || 'Email verified successfully!');
      setShowOtpInput(false);
      setOtp('');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20 }}>
      <h2 style={{ display: "flex", justifyContent: "center" }}>Register Window</h2>
      {!showOtpInput ? (
        <form onSubmit={handleRegisterSubmit}>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
          <button type="submit" style={{ width: '100%', padding: 10 }}>
            Register
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
          <button type="submit" style={{ width: '100%', padding: 10 }}>
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
