import { useState } from 'react';
import api from '../api/axios';
import '../styles/TareaItem.css';

function TareaItem({ tarea, onActualizar, onEliminar }) {
  const [editando, setEditando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(tarea?.titulo || '');

  // ✅ Si la tarea no es válida, no renderiza nada
  if (!tarea || !tarea.id) return null;

  const actualizarTarea = async (data) => {
    try {
      const res = await api.put(`/tareas/${tarea.id}`, data);
      const actualizada = res.data.data || res.data;
      onActualizar(actualizada);
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
    if (!nuevoTitulo.trim()) {
      alert('El título no puede estar vacío');
      return;
    }
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
    <div className={`tarea-item ${tarea.completada ? 'completada' : ''}`}>
      {editando ? (
        <>
          <input
            className="tarea-input"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
          />
          <button className="btn guardar" onClick={guardarCambios}>Guardar</button>
          <button className="btn cancelar" onClick={() => setEditando(false)}>Cancelar</button>
        </>
      ) : (
        <div className="tarea-contenido">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={tarea.completada}
              onChange={toggleCompletada}
            />
            <span className="checkmark"></span>
          </label>
          <span className={`tarea-titulo ${tarea.completada ? 'completada' : ''}`}>
            {tarea.titulo}
          </span>
          <div className="botones-tarea">
            <button className="btn editar" onClick={() => setEditando(true)}>Editar</button>
            <button className="btn eliminar" onClick={eliminarTarea}>Eliminar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TareaItem;
