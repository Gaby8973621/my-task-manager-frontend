import { useState } from 'react';
import api from '../api/axios';

function TareaItem({ tarea, onActualizar, onEliminar }) {
  const [editando, setEditando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(tarea.titulo);

  const actualizarTarea = async (data) => {
    try {
      const res = await api.put(`/tareas/${tarea.id}`, data);
      onActualizar(res.data);
      setEditando(false);
    } catch (err) {
      console.error('Error al actualizar la tarea:', err);
      alert('Error al actualizar la tarea');
    }
  };

  const toggleCompletada = () => {
    actualizarTarea({ completada: !tarea.completada, titulo: tarea.titulo });
  };

  const guardarCambios = () => {
    actualizarTarea({ titulo: nuevoTitulo, completada: tarea.completada });
  };

  const eliminarTarea = async () => {
    try {
      await api.delete(`/tareas/${tarea.id}`);
      onEliminar(tarea.id);
    } catch (err) {
      console.error('Error eliminando la tarea:', err);
      alert('Error eliminando la tarea');
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      {editando ? (
        <>
          <input
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
          />
          <button onClick={guardarCambios}>Guardar</button>
          <button onClick={() => setEditando(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <span>
            <strong>{tarea.titulo}</strong> -{' '}
            {tarea.completada ? '✅ Completada' : '❌ Incompleta'}
          </span>
          <button onClick={toggleCompletada}>
            {tarea.completada ? 'Marcar incompleta' : 'Marcar completada'}
          </button>
          <button onClick={() => setEditando(true)}>Editar</button>
          <button onClick={eliminarTarea}>Eliminar</button>
        </>
      )}
    </div>
  );
}

export default TareaItem;
