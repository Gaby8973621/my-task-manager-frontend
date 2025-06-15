import { useEffect, useState } from 'react';
import api from '../api/axios';
import TareaForm from './TareaForm';
import TareaItem from './TareaItem';
import '../styles/TareaLista.css';

function TareaLista() {
  //Lista de tareas
  const [tareas, setTareas] = useState([]); 
  // mostrar errores
  const [error, setError] = useState('');   

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const res = await api.get('/tareas');
        const data = res.data.data || res.data;
        setTareas(Array.isArray(data) ? data : []); 
        setError('');
      } catch (err) {
        if (err.response?.status === 401) {
          //Maneja token expirado o inválido
          setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError('Error al cargar tareas');
        }
        console.error('Error en cargarTareas:', err);
      }
    };

    cargarTareas(); 
  }, []);

  const agregarTarea = (nueva) => {
    //Verifica que la tarea sea válida
    if (!nueva || !nueva.id) return; 
    //Agrega la nueva tarea al inicio
    setTareas((prev) => [nueva, ...prev]); 
  };

  const actualizarTarea = (actualizada) => {
    //Reemplaza la tarea con el mismo ID
    setTareas((prev) =>
      prev.map((t) => (t.id === actualizada.id ? actualizada : t))
    );
  };

  const eliminarTarea = (id) => {
    //Elimina la tarea 
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="task-list-container">
      {/*Formulario para agregar tareas */}
      <TareaForm onTareaAgregada={agregarTarea} />

      {error && <p className="task-error">{error}</p>}

      {tareas.length === 0 ? (
        //Mensaje cuando no hay tareas
        <p className="task-empty">No hay tareas.</p>
      ) : (
        <div className="task-list">
          {/*muestra cada tarea usando el componente TareaItem */}
          {tareas
          //Filtra tareas que no estan validadas
            .filter((t) => t && t.id) 
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
