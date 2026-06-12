import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  // ✅ CARGAR DATOS
  const cargarConvocatorias = async () => {
    const { data, error } = await supabase
      .from("convocatorias")
      .select("*")
      .order("fecha", { ascending: true });

    if (error) {
      console.error("ERROR SELECT:", error);
    } else {
      setConvocatorias(data || []);
    }
  };

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  // ✅ AGREGAR
  const agregar = async () => {
    if (!nombre) return;

    const { error } = await supabase.from("convocatorias").insert([
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

    if (error) {
      console.error("ERROR INSERT:", error);
    } else {
      cargarConvocatorias();
      setNombre("");
    }
  };

  // ✅ ✅ ✅ FIX FINAL (ESTE ERA EL PROBLEMA DE TODO)
  const actualizarCampo = async (id, campo, valor) => {

    // 🔹 Actualizar UI correctamente
    const copia = convocatorias.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );
    setConvocatorias(copia);

    // 🔹 Actualizar BD correctamente
    const { error } = await supabase
      .from("convocatorias")
      .update({ [campo]: valor })
      .eq("id", id);

    if (error) {
      console.error("ERROR UPDATE:", error);
    }
  };

  // ✅ DASHBOARD - ESTATUS
  const resumenEstatus = {
    preparacion: convocatorias.filter(c => c.estatus === "En preparación").length,
    postuladas: convocatorias.filter(c => c.estatus === "Postulada").length,
    aprobadas: convocatorias.filter(c => c.estatus === "Aprobada").length,
    rechazadas: convocatorias.filter(c => c.estatus === "No seleccionada").length
  };

  // ✅ DASHBOARD - PRÓXIMAS
  const proximas = convocatorias
    .filter(c => c.fecha)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, 3);

  // ✅ COLOR ESTATUS
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
      fontFamily: "Arial",
      background: "#f5f5f5",
      minHeight: "100vh"
    }}>

      <h1>Sistema de Convocatorias 📊</h1>

      {/* ✅ DASHBOARD */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>

        {/* ESTATUS */}
        <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
          <h3>📌 Estatus</h3>
          <p>🟡 En preparación: {resumenEstatus.preparacion}</p>
          <p>🔵 Postuladas: {resumenEstatus.postuladas}</p>
          <p>🟢 Aprobadas: {resumenEstatus.aprobadas}</p>
          <p>🔴 No seleccionadas: {resumenEstatus.rechazadas}</p>
        </div>

        {/* PRÓXIMAS */}
        <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
          <h3>📅 Próximas</h3>
          {proximas.length === 0 && <p>No hay fechas</p>}
          {proximas.map(c => (
            <p key={c.id}>
              {c.nombre} → {c.fecha}
            </p>
          ))}
        </div>

      </div>

      {/* CREAR */}
      <div style={{ marginBottom: "25px" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la convocatoria"
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      {/* TARJETAS */}
      <div style={{
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))"
      }}>
        {convocatorias.map((c) => (
          <div key={c.id} style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            borderLeft: `6px solid ${colorEstatus(c.estatus)}`
          }}>

            {/* NOMBRE */}
            <input
              value={c.nombre || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "nombre", e.target.value)
              }
              style={{ width: "100%", fontWeight: "bold", marginBottom: "10px" }}
            />

            <label>🏢 Organización</label>
            <input
              value={c.organizacion || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "organizacion", e.target.value)
              }
            />

            <label>📌 Estatus</label>
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

            <label>💰 Financiamiento</label>
            <input
              value={c.financiamiento || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "financiamiento", e.target.value)
              }
            />

            <label>💱 Moneda</label>
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

            <label>🧠 Área</label>
            <input
              value={c.area || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "area", e.target.value)
              }
            />

            <label>👤 Responsable</label>
            <input
              value={c.responsable || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "responsable", e.target.value)
              }
            />

            <label>📅 Fecha</label>
            <input
              type="date"
              value={c.fecha || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "fecha", e.target.value)
              }
            />

            <label>🔗 Enlace</label>
            <input
              value={c.link || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "link", e.target.value)
              }
            />

          </div>
        ))}
      </div>
    </div>
  );
}
