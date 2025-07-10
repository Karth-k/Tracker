import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user?.name} Hello</h2>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default Dashboard;
