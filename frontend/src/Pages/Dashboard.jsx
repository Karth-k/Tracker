import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();           
    navigate('/login'); 
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user?.name} 👋</h2>
      <p>Email: {user?.email}</p>

      <Link to="/groups" style={{ marginTop: 20, display: 'inline-block', color: '#1E90FF' }}>
        View Groups
      </Link>

      <br /><br />

      <button onClick={handleLogout} style={{ padding: 10, background: 'crimson', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
