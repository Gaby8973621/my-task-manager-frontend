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
      // redirige al login si no esta el token
      navigate('/login');
      return;
    }

    try {
      //  token JWT
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      // Guarda el email user
      setUserEmail(payload.email || 'Usuario');

      // Verifica si el usuario tiene rol Admin o Super Admin
      const roles = payload.role || [];
      setIsAdmin(roles.includes('Admin') || roles.includes('Super Admin'));

    } catch (error) {
      
      console.error('Token inválido o corrupto', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Elimina el token y redirige al login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-title">Bienvenido a Mi Gestor</h1>

        {isAdmin && (
          // mensaje solo para el admin
          <div className="admin-banner">
            <p> Bienvenido Admin</p>
          </div>
        )}

        <p className="dashboard-user">Sesión activa: {userEmail}</p>

        {/* Componente de la lista de tareas */}
        <TareaLista />

        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
