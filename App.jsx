import { useState } from "react";

export default function SistemaConvocatorias() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  const agregar = () => {
    if (!nombre) return;
    setConvocatorias([...convocatorias, { nombre }]);
    setNombre("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Sistema de Convocatorias</h1>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la convocatoria"
      />
      <button onClick={agregar}>Agregar</button>

      <ul>
        {convocatorias.map((c, i) => (
          <li key={i}>{c.nombre}</li>
        ))}
      </ul>
    </div>
  );
}
