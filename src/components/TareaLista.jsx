import { useEffect, useState } from 'react';
import api from '../api/axios';
import TareaForm from './TareaForm';
import TareaItem from './TareaItem';
import '../styles/TareaLista.css';

function TareaLista() {
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const res = await api.get('/tareas');
        setTareas(res.data.data || []);
        setError('');
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError('Error al cargar tareas');
        }
        console.error(err);
      }
    };

    cargarTareas();
  }, []);

  const agregarTarea = (nueva) => {
    setTareas([nueva, ...tareas]);
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
      <TareaForm onTareaAgregada={agregarTarea} />

      {error && <p className="task-error">{error}</p>}

      {tareas.length === 0 ? (
        <p className="task-empty">No hay tareas.</p>
      ) : (
        <ul className="task-list">
          {tareas.map((tarea) => (
            <li key={tarea.id}>
              <TareaItem
                tarea={tarea}
                onActualizar={actualizarTarea}
                onEliminar={eliminarTarea}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TareaLista;
