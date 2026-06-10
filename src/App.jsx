import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [texto, setTexto] = useState("");

  const agregar = () => {
    if (!texto) return;
    setItems([...items, texto]);
    setTexto("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Sistema de Convocatorias ✅</h1>

      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe una convocatoria"
      />

      <button onClick={agregar}>Agregar</button>

      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
