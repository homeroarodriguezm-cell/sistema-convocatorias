import { useState } from "react";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  const agregar = () => {
    if (!nombre) return;

    const nueva = {
      nombre,
      estatus: "En preparación",
      fecha: new Date().toLocaleDateString(),
    };

    setConvocatorias([...convocatorias, nueva]);
    setNombre("");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>
      
      <h1 style={{ marginBottom: "20px" }}>Sistema de Convocatorias 📊</h1>

      {/* FORMULARIO */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la convocatoria"
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button onClick={agregar} style={{ padding: "10px 15px" }}>
          Agregar
        </button>
      </div>

      {/* LISTA EN TARJETAS */}
      <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
        
        {convocatorias.map((c, i) => (
          <div
            key={i}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{c.nombre}</h3>

            <p style={{ fontSize: "14px", color: "#555" }}>
              📌 Estatus: {c.estatus}
            </p>

            <p style={{ fontSize: "14px", color: "#555" }}>
              📅 Fecha: {c.fecha}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}
