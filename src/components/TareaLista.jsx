import { useEffect, useState } from 'react';
import api from '../api/axios';
import TareaForm from './TareaForm';
import TareaItem from './TareaItem';
import '../styles/TareaLista.css';

function TareaLista() {
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState('');
  const [mensajeAdmin, setMensajeAdmin] = useState('');

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const res = await api.get('/tareas');
        // ✅ Asegura que sea un arreglo
        const data = res.data.data || res.data;
        setTareas(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError('Error al cargar tareas');
        }
        console.error('Error en cargarTareas:', err);
      }
    };

    const verificarAdmin = async () => {
      try {
        const res = await api.get('/admin-dashboard');
        setMensajeAdmin(res.data.message);
      } catch {
        setMensajeAdmin('');
      }
    };

    cargarTareas();
    verificarAdmin();
  }, []);

  const agregarTarea = (nueva) => {
    if (!nueva || !nueva.id) return;
    setTareas((prev) => [nueva, ...prev]);
  };

  const actualizarTarea = (actualizada) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === actualizada.id ? actualizada : t))
    );
  };

  const eliminarTarea = (id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="task-list-container">
      {/* ✅ Mensaje visible solo si hay permisos de admin */}
      {mensajeAdmin && <div className="admin-message">{mensajeAdmin}</div>}

      <TareaForm onTareaAgregada={agregarTarea} />

      {error && <p className="task-error">{error}</p>}

      {tareas.length === 0 ? (
        <p className="task-empty">No hay tareas.</p>
      ) : (
        <div className="task-list">
          {tareas
            .filter((t) => t && t.id) // Validar tareas válidas
            .map((tarea) => (
              <TareaItem
                key={tarea.id}
                tarea={tarea}
                onActualizar={actualizarTarea}
                onEliminar={eliminarTarea}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default TareaLista;
