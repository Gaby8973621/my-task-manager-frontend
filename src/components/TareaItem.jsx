import { useState } from 'react';
import api from '../api/axios';
import '../styles/TareaItem.css';

function TareaItem({ tarea, onActualizar, onEliminar }) {
   //Estado para saber si se está editando la tarea
  const [editando, setEditando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(tarea?.titulo || '');
  const [nuevaDescripcion, setNuevaDescripcion] = useState(tarea?.descripcion || '');

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
    //Cambia el estado de completada 
    actualizarTarea({ 
      completada: !tarea.completada, 
      titulo: tarea.titulo, 
      descripcion: tarea.descripcion 
    });
  };

  const guardarCambios = () => {
    if (!nuevoTitulo.trim()) {
      alert('El título no puede estar vacío');
      return;
    }
    //Guarda los datos de la tarea
    actualizarTarea({
      titulo: nuevoTitulo,
      descripcion: nuevaDescripcion,
      completada: tarea.completada
    });
  };

  const eliminarTarea = async () => {
    try {
      //Elimina la tarea por ID
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
        <div className="tarea-edicion">
          <input
            className="tarea-input"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
            placeholder="Título"
          />
          <textarea
            className="tarea-textarea"
            value={nuevaDescripcion}
            onChange={(e) => setNuevaDescripcion(e.target.value)}
            placeholder="Descripción"
          />
          <div className="botones-tarea">
            <button className="btn guardar" onClick={guardarCambios}>Guardar</button>
            <button className="btn cancelar" onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="tarea-contenido">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={tarea.completada}
              //Marca como completada/incompleta
              onChange={toggleCompletada} 
            />
            <span className="checkmark"></span>
          </label>

          <div className="tarea-textos">
            <span className={`tarea-titulo ${tarea.completada ? 'completada' : ''}`}>
              {tarea.titulo}
            </span>
            {tarea.descripcion && (
              <p className="tarea-descripcion">{tarea.descripcion}</p>
            )}
          </div>

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
