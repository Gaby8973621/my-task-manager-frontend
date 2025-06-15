import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const res = await api.post('/auth/login', { email, password });

      //Guarda el token en localStorage 
      localStorage.setItem('token', res.data.access_token);

      //Guarda el primer rol si es un arreglo
      if (Array.isArray(res.data.role)) {
        localStorage.setItem('rol', res.data.role[0]);
      }

      // Redirige al dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.errors ||
        err.response?.data?.message ||
        'Credenciales inválidas';
        //mensaje de error al usuario
      setError(msg); 
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <p className="login-error">{error}</p>}

        <input
          type="email"
          placeholder="Correo"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">
          Iniciar sesión
        </button>

        <p className="login-register">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
