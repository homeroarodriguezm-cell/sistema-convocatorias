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
        estatus: "En preparación",
        link: ""
      }
    ]);

    cargarConvocatorias();
    setNombre("");
  };

  // ✅ FIX CORRECTO (ya no usamos "valor")
  const actualizarCampo = async (id, campo, valor) => {

    // actualizar UI correctamente
    const copia = convocatorias.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );

    setConvocatorias(copia);

    // actualizar BD correctamente
    await supabase
      .from("convocatorias")
      .update({ [campo]: valor })
      .eq("id", id);
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
      <div style={{
        display: "grid",
        gap: "15px",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
      }}>
        {convocatorias.map((c) => (
          <div key={c.id} style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px"
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

            {/* ✅ NUEVO CAMPO LINK */}
            <label>🔗 Enlace:</label>
            <input
              value={c.link || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "link", e.target.value)
              }
              placeholder="https://..."
            />

          </div>
        ))}
      </div>
    </div>
  );
}
