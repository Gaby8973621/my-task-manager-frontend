import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TareaLista from '../components/TareaLista';
import '../styles/Dashboard.css';

function Dashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      setUserEmail(payload.email || 'Usuario');

      const roles = payload.role || [];
      setIsAdmin(roles.includes('Admin') || roles.includes('Super Admin'));

    } catch (error) {
      console.error('Token inválido o corrupto', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-title">Bienvenido a Mi Gestor</h1>

        {isAdmin && (
          <div className="admin-banner">
            <p> Bienvenido Admin</p>
          </div>
        )}

        <p className="dashboard-user">Sesión activa: {userEmail}</p>

        <TareaLista />

        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
