import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Register.css';

function Register() {
  const [name, setName] = useState(''); // ✅ Estado para el nombre
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await api.post('/auth/register', {
        name, // ✅ Se envía al backend
        email,
        password,
        password_confirmation: confirmPassword,
      });

      const token =
        res.data?.original?.token || res.data?.token || res.data?.data?.original?.token;

      if (token) {
        localStorage.setItem('token', token); 
        navigate('/dashboard'); 
      } else {
        setError('Registro exitoso, pero no se recibió token. Inicia sesión manualmente.');
      }

    } catch (err) {
      console.error('Error de registro:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.errors?.password?.[0] ||
        'Error al registrarse';
      setError(msg);
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Crear cuenta</h2>
        {error && <p className="register-error">{error}</p>}

        <input
          type="text"
          placeholder="Nombre completo"
          className="register-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Correo"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          className="register-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="register-button">
          Registrarse
        </button>

        <p className="register-login">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
