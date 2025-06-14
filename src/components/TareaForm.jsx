import { useState } from 'react';
import api from '../api/axios';
import '../styles/TareaForm.css';

function TareaForm({ onTareaAgregada }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/tareas', {
        titulo,
        descripcion,
        completada: false,
      });

      onTareaAgregada(res.data); // Actualiza la lista en el componente padre
      setTitulo('');
      setDescripcion('');
      setError('');
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.titulo?.[0] ||
        'Error al crear la tarea';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Título de la tarea"
        className="task-input"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />

      <textarea
        placeholder="Descripción (opcional)"
        className="task-textarea"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={3}
      />

      <button type="submit" className="task-button">
        Añadir
      </button>

      {error && <p className="task-error">{error}</p>}
    </form>
  );
}

export default TareaForm;
