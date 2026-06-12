import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  // ✅ Cargar datos
  const cargarConvocatorias = async () => {
    const { data, error } = await supabase
      .from("convocatorias")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("ERROR SELECT:", error);
    } else {
      setConvocatorias(data || []);
    }
  };

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  // ✅ Agregar nueva convocatoria
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
        estatus: "En preparación"
      }
    ]);

    if (error) {
      console.error("ERROR INSERT:", error);
    } else {
      cargarConvocatorias();
      setNombre("");
    }
  };

  // ✅ ✅ ✅ ESTE ES EL FIX REAL
  const actualizarCampo = async (id, campo, valor) => {

    // ✅ actualizar UI correctamente
    const copia = convocatorias.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );

    setConvocatorias(copia);

    // ✅ actualizar BD correctamente
    const { error } = await supabase
      .from("convocatorias")
      .update({ [campo]: valor })   // 🔥 FIX REAL AQUÍ
      .eq("id", id);

    if (error) {
      console.error("ERROR UPDATE:", error);
    }
  };

  // ✅ limpiar números
  const limpiarNumero = (valor) => {
    if (!valor) return 0;
    const limpio = valor.toString().replace(/\./g, "");
    const num = parseFloat(limpio);
    return isNaN(num) ? 0 : num;
  };

  const totales = { USD: 0, EUR: 0, Bs: 0 };

  convocatorias.forEach(c => {
    const v = limpiarNumero(c.financiamiento);
    if (c.moneda === "USD") totales.USD += v;
    if (c.moneda === "EUR") totales.EUR += v;
    if (c.moneda === "Bs") totales.Bs += v;
  });

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

      {/* DASHBOARD */}
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
      </div>

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

            <input
              value={c.nombre || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "nombre", e.target.value)
              }
            />

            <label>🏢 Organización:</label>
            <input
              value={c.organizacion || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "organizacion", e.target.value)
              }
            />

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

          </div>
        ))}
      </div>
    </div>
  );
}
