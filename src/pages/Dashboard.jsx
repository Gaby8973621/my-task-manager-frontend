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
    } else {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // decodifica el token
        setUserEmail(payload.email || 'Usuario autenticado');
        const roles = payload.role || [];
        setIsAdmin(roles.includes('Admin') || roles.includes('Super Admin'));
      } catch (error) {
        console.error('Error al decodificar el token', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-title">Bienvenido a My Task Manager</h1>
        {isAdmin && <p className="admin-banner">Bienvenido Admin 👑</p>}
        <p className="dashboard-user">{userEmail}</p>

        <TareaLista />

        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
