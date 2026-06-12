import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  // ✅ cargar datos
  const cargarConvocatorias = async () => {
    const { data } = await supabase
      .from("convocatorias")
      .select("*");

    setConvocatorias(data || []);
  };

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  // ✅ agregar
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
        estatus: "En preparación",
        link: ""
      }
    ]);

    cargarConvocatorias();
    setNombre("");
  };

  // ✅ ✅ ✅ FIX REAL FINAL
  const actualizarCampo = async (id, campo, valor) => {

    // UI correcta
    const copia = convocatorias.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );

    setConvocatorias(copia);

    // BD correcta
    await supabase
      .from("convocatorias")
      .update({ [campo]: valor })
      .eq("id", id);
  };

  // ✅ DASHBOARD
  const resumenEstatus = {
    preparacion: convocatorias.filter(c => c.estatus === "En preparación").length,
    postuladas: convocatorias.filter(c => c.estatus === "Postulada").length,
    aprobadas: convocatorias.filter(c => c.estatus === "Aprobada").length,
    rechazadas: convocatorias.filter(c => c.estatus === "No seleccionada").length
  };

  const proximas = convocatorias
    .filter(c => c.fecha)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, 3);

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
    <div style={{
      padding: "30px",
      background: "#f5f7fa",
      minHeight: "100vh",
      fontFamily: "Arial"
    }}>

      <h1>Sistema de Convocatorias 📊</h1>

      {/* ✅ DASHBOARD */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <h3>📌 Estatus</h3>
          <p>🟡 {resumenEstatus.preparacion}</p>
          <p>🔵 {resumenEstatus.postuladas}</p>
          <p>🟢 {resumenEstatus.aprobadas}</p>
          <p>🔴 {resumenEstatus.rechazadas}</p>
        </div>

        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <h3>📅 Próximas</h3>
          {proximas.map(c => (
            <p key={c.id}>{c.nombre} → {c.fecha}</p>
          ))}
        </div>
      </div>

      {/* CREAR */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nueva convocatoria"
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      {/* TARJETAS PRO */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "20px"
      }}>
        {convocatorias.map(c => (
          <div key={c.id} style={{
            background: "white",
            padding: "20px",
            borderRadius: "14px",
            borderLeft: `6px solid ${colorEstatus(c.estatus)}`
          }}>

            <input
              value={c.nombre || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "nombre", e.target.value)
              }
              style={{ width: "100%", fontWeight: "bold", marginBottom: "15px" }}
            />

            <div style={{ marginBottom: "10px" }}>
              <label>🏢 Organización</label>
              <input value={c.organizacion || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "organizacion", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>📌 Estatus</label>
              <select value={c.estatus || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "estatus", e.target.value)}
                style={{ width: "100%" }}
              >
                <option>En preparación</option>
                <option>Postulada</option>
                <option>Aprobada</option>
                <option>No seleccionada</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                placeholder="Monto"
                value={c.financiamiento || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "financiamiento", e.target.value)}
                style={{ flex: 1 }}
              />

              <select
                value={c.moneda || "USD"}
                onChange={(e) =>
                  actualizarCampo(c.id, "moneda", e.target.value)}
              >
                <option>USD</option>
                <option>EUR</option>
                <option>Bs</option>
              </select>
            </div>

            <div style={{ marginTop: "10px" }}>
              <label>📅 Fecha</label>
              <input type="date"
                value={c.fecha || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "fecha", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginTop: "10px" }}>
              <label>🔗 Enlace</label>
              <input
                value={c.link || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "link", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
