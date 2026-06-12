import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  // ✅ Cargar datos
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

  // ✅ Crear nueva convocatoria
  const agregar = async () => {
    if (!nombre) return;

    await supabase.from("convocatorias").insert([
      {
        nombre,
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

  // ✅ Actualizar campo
  const actualizarCampo = async (id, campo, valor) => {
    const copia = convocatorias.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );

    setConvocatorias(copia);

    await supabase
      .from("convocatorias")
      .update({ [campo]: valor })
      .eq("id", id);
  };

  // ✅ Limpiar número
  const limpiarNumero = (valor) => {
    if (!valor) return 0;
    const limpio = valor.toString().replace(/\./g, "");
    const n = parseFloat(limpio);
    return isNaN(n) ? 0 : n;
  };

  // ✅ Totales por moneda
  const totales = { USD: 0, EUR: 0, Bs: 0 };

  convocatorias.forEach(c => {
    const valor = limpiarNumero(c.financiamiento);
    if (c.moneda === "USD") totales.USD += valor;
    if (c.moneda === "EUR") totales.EUR += valor;
    if (c.moneda === "Bs") totales.Bs += valor;
  });

  // ✅ Conteo por estatus
  const resumenEstatus = {
    preparacion: convocatorias.filter(c => c.estatus === "En preparación").length,
    postuladas: convocatorias.filter(c => c.estatus === "Postulada").length,
    aprobadas: convocatorias.filter(c => c.estatus === "Aprobada").length,
    rechazadas: convocatorias.filter(c => c.estatus === "No seleccionada").length
  };

  // ✅ Colores de estatus
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
    <div style={{ padding: "30px", fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>

      <h1>Sistema de Convocatorias 📊</h1>

      {/* 🔥 DASHBOARD */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
      }}>

        <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
          <h3>📊 Total</h3>
          <p>{convocatorias.length}</p>
        </div>

        <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
          <h3>💰 Financiamiento</h3>
          <p>USD: ${totales.USD.toLocaleString()}</p>
          <p>EUR: €{totales.EUR.toLocaleString()}</p>
          <p>Bs: Bs {totales.Bs.toLocaleString()}</p>
        </div>

        <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
          <h3>📌 Estatus</h3>
          <p>🟡 {resumenEstatus.preparacion}</p>
          <p>🔵 {resumenEstatus.postuladas}</p>
          <p>🟢 {resumenEstatus.aprobadas}</p>
          <p>🔴 {resumenEstatus.rechazadas}</p>
        </div>

      </div>

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
      <div style={{
        display: "grid",
        gap: "15px",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
      }}>
        {convocatorias.map((c) => (
          <div key={c.id} style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            borderLeft: `6px solid ${colorEstatus(c.estatus)}`
          }}>

            <h3>{c.nombre}</h3>

            {/* ✅ ESTATUS */}
            <div>
              <label>📌 Estatus:</label>
              <select
                value={c.estatus || "En preparación"}
                onChange={(e) =>
                  actualizarCampo(c.id, "estatus", e.target.value)
                }
                style={{ width: "100%" }}
              >
                <option>En preparación</option>
                <option>Postulada</option>
                <option>Aprobada</option>
                <option>No seleccionada</option>
              </select>
            </div>

            <div>
              <label>💰 Financiamiento:</label>
              <input
                value={c.financiamiento || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "financiamiento", e.target.value)
                }
              />
            </div>

            <div>
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
            </div>

            <div>
              <label>🧠 Área:</label>
              <input
                value={c.area || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "area", e.target.value)
                }
              />
            </div>

            <div>
              <label>📅 Fecha:</label>
              <input
                type="date"
                value={c.fecha || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "fecha", e.target.value || null)
                }
              />
            </div>

            <div>
              <label>👤 Responsable:</label>
              <input
                value={c.responsable || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "responsable", e.target.value)
                }
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
