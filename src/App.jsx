import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  // ✅ Cargar datos al iniciar
  const cargarConvocatorias = async () => {
    const { data, error } = await supabase
      .from("convocatorias")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setConvocatorias(data);
    }
  };

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  // ✅ Crear nueva convocatoria (guardar)
  const agregar = async () => {
    if (!nombre) return;

    const { error } = await supabase.from("convocatorias").insert([
      {
        nombre,
        financiamiento: "",
        moneda: "USD",
        area: "",
        fecha: null,
        responsable: "",
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      cargarConvocatorias();
    }

    setNombre("");
  };

  // ✅ Actualizar campo en BD
  const actualizarCampo = async (id, campo, valor) => {
    const { error } = await supabase
      .from("convocatorias")
      .update({ [campo]: valor })
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      cargarConvocatorias();
    }
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
        {convocatorias.map((c) => (
          <div
            key={c.id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{c.nombre}</h3>

            <label>💰 Financiamiento:</label>
            <input
              value={c.financiamiento || ""}
              onChange={(e) => actualizarCampo(c.id, "financiamiento", e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <label>💱 Moneda:</label>
            <select
              value={c.moneda || "USD"}
              onChange={(e) => actualizarCampo(c.id, "moneda", e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            >
              <option>USD</option>
              <option>EUR</option>
              <option>Bs</option>
            </select>

            <label>🧠 Área:</label>
            <input
              value={c.area || ""}
              onChange={(e) => actualizarCampo(c.id, "area", e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <label>📅 Fecha límite:</label>
            <input
              type="date"
              value={c.fecha || ""}
              onChange={(e) => actualizarCampo(c.id, "fecha", e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <label>👤 Responsable:</label>
            <input
              value={c.responsable || ""}
              onChange={(e) => actualizarCampo(c.id, "responsable", e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
``
