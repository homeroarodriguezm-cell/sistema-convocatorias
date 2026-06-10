import { useState } from "react";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  const agregar = () => {
    if (!nombre) return;

    const nueva = {
      nombre,
      financiamiento: "",
      moneda: "USD",
      area: "",
      fecha: "",
      responsable: ""
    };

    setConvocatorias([...convocatorias, nueva]);
    setNombre("");
  };

  const actualizarCampo = (index, campo, valor) => {
    const copia = [...convocatorias];
    copia[index][campo] = valor;
    setConvocatorias(copia);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>
      
      <h1>Sistema de Convocatorias 📊</h1>

      {/* CREAR */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la convocatoria"
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      {/* TARJETAS */}
      <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        
        {convocatorias.map((c, i) => (
          <div
            key={i}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{c.nombre}</h3>

            <label>💰 Financiamiento:</label>
            <input
              value={c.financiamiento}
              onChange={(e) => actualizarCampo(i, "financiamiento", e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <label>💱 Moneda:</label>
            <select
              value={c.moneda}
              onChange={(e) => actualizarCampo(i, "moneda", e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            >
              <option>USD</option>
              <option>EUR</option>
              <option>Bs</option>
            </select>

            <label>🧠 Área:</label>
            <input
              value={c.area}
              onChange={(e) => actualizarCampo(i, "area", e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <label>📅 Fecha límite:</label>
            <input
              type="date"
              value={c.fecha}
              onChange={(e) => actualizarCampo(i, "fecha", e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <label>👤 Responsable:</label>
            <input
              value={c.responsable}
              onChange={(e) => actualizarCampo(i, "responsable", e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </div>
        ))}

      </div>

    </div>
  );
}
