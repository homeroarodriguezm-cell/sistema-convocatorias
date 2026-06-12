import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    cargarConvocatorias();
  }, []);

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

  const agregar = async () => {
    if (!nombre) return;

    const { error } = await supabase
      .from("convocatorias")
      .insert([
        {
          nombre,
          financiamiento: "",
          moneda: "USD",
          area: "",
          fecha: null,
          responsable: ""
        }
      ]);

    if (error) {
      console.error("ERROR INSERT:", error);
    } else {
      cargarConvocatorias();
    }

    setNombre("");
  };

  const actualizarCampo = async (id, campo, valor) => {
    const updateData = {};
    updateData[campo] = valor;

    const { error } = await supabase
      .from("convocatorias")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("ERROR UPDATE:", error);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1>Sistema de Convocatorias 📊</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la convocatoria"
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {convocatorias.map((c) => (
          <div
            key={c.id}
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
              value={c.financiamiento || ""}
              onChange={(e) => actualizarCampo(c.id, "financiamiento", e.target.value)}
            />

            <label>💱 Moneda:</label>
            <select
              value={c.moneda || "USD"}
              onChange={(e) => actualizarCampo(c.id, "moneda", e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="Bs">Bs</option>
            </select>

            <label>🧠 Área:</label>
            <input
              value={c.area || ""}
              onChange={(e) => actualizarCampo(c.id, "area", e.target.value)}
            />

            <label>📅 Fecha límite:</label>
            <input
              type="date"
              value={c.fecha || ""}
              onChange={(e) => actualizarCampo(c.id, "fecha", e.target.value || null)}
            />

            <label>👤 Responsable:</label>
            <input
              value={c.responsable || ""}
              onChange={(e) => actualizarCampo(c.id, "responsable", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
