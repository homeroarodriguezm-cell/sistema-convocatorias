import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  const cargarConvocatorias = async () => {
    const { data } = await supabase
      .from("convocatorias")
      .select("*")
      .order("id", { ascending: false });

    setConvocatorias(data || []);
  };

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  const agregar = async () => {
    if (!nombre) return;

    await supabase.from("convocatorias").insert([
      {
        nombre,
        organizacion: "",
        financiamiento: "",
        moneda: "USD",
        area: "",
        fecha: null,
        responsable: "",
        estatus: "En preparación"
      }
    ]);

    cargarConvocatorias();
    setNombre("");
  };

  const actualizarCampo = async (id, campo, valor) => {

    // ✅ actualizar UI correctamente
    const copia = convocatorias.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );

    setConvocatorias(copia);

    // ✅ guardar en BD correctamente
    const { error } = await supabase
      .from("convocatorias")
      .update({ [campo]: valor })
      .eq("id", id);

    if (error) {
      console.error("ERROR UPDATE:", error);
    }
  };

  const colorEstatus = (estatus) => {
    switch (estatus) {
      case "En preparación": return "#facc15";
      case "Postulada": return "#3b82f6";
      case "Aprobada": return "#22c55e";
      case "No seleccionada": return "#ef4444";
      default: return "#ccc";
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", background: "#f5f5f5" }}>

      <h1>Sistema de Convocatorias 📊</h1>

      {/* CREAR */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la convocatoria"
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      {/* TARJETAS */}
      <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {convocatorias.map((c) => (
          <div key={c.id} style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            borderLeft: `6px solid ${colorEstatus(c.estatus)}`
          }}>

            {/* ✅ NOMBRE EDITABLE */}
            <input
              value={c.nombre || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "nombre", e.target.value)
              }
              style={{ fontWeight: "bold", fontSize: "16px", width: "100%" }}
            />

            {/* ✅ ORGANIZACIÓN */}
            <label>🏢 Organización:</label>
            <input
              value={c.organizacion || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "organizacion", e.target.value)
              }
            />

            {/* ✅ ESTATUS */}
            <label>📌 Estatus:</label>
            <select
              value={c.estatus || "En preparación"}
              onChange={(e) =>
                actualizarCampo(c.id, "estatus", e.target.value)
              }
            >
              <option>En preparación</option>
              <option>Postulada</option>
              <option>Aprobada</option>
              <option>No seleccionada</option>
            </select>

            <label>💰 Financiamiento:</label>
            <input
              value={c.financiamiento || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "financiamiento", e.target.value)
              }
            />

            <label>💱 Moneda:</label>
            <select
              value={c.moneda || "USD"}
              onChange={(e) =>
                actualizarCampo(c.id, "moneda", e.target.value)
              }
            >
              <option>USD</option>
              <option>EUR</option>
              <option>Bs</option>
            </select>

            <label>🧠 Área:</label>
            <input
              value={c.area || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "area", e.target.value)
              }
            />

            <label>📅 Fecha:</label>
            <input
              type="date"
              value={c.fecha || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "fecha", e.target.value || null)
              }
            />

            <label>👤 Responsable:</label>
            <input
              value={c.responsable || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "responsable", e.target.value)
              }
            />

          </div>
        ))}
      </div>
    </div>
  );
}
