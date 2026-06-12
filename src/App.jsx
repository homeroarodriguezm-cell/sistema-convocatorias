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

  // ✅ Crear nueva convocatoria
  const agregar = async () => {
    if (!nombre) return;

    const { error } = await supabase.from("convocatorias").insert([
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

  // ✅ Actualizar campo (con UI inmediata)
  const actualizarCampo = async (id, campo, valor) => {
    // 🔹 Actualizar en pantalla
    const copia = convocatorias.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );
    setConvocatorias(copia);

    // 🔹 Guardar en BD
    const { error } = await supabase
      .from("convocatorias")
      .update({ [campo]: valor })
      .eq("id", id);

    if (error) {
      console.error("ERROR UPDATE:", error);
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
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))"
      }}>
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

            {/* 💰 Financiamiento */}
            <div style={{ marginBottom: "10px" }}>
              <label>💰 Financiamiento:</label>
              <input
                value={c.financiamiento || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "financiamiento", e.target.value)
                }
                style={{ width: "100%", padding: "5px" }}
              />
            </div>

            {/* 💱 Moneda */}
            <div style={{ marginBottom: "10px" }}>
              <label>💱 Moneda:</label>
              <select
                value={c.moneda || "USD"}
                onChange={(e) =>
                  actualizarCampo(c.id, "moneda", e.target.value)
                }
                style={{ width: "100%", padding: "5px" }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="Bs">Bs</option>
              </select>
            </div>

            {/* 🧠 Área */}
            <div style={{ marginBottom: "10px" }}>
              <label>🧠 Área:</label>
              <input
                value={c.area || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "area", e.target.value)
                }
                style={{ width: "100%", padding: "5px" }}
              />
            </div>

            {/* 📅 Fecha */}
            <div style={{ marginBottom: "10px" }}>
              <label>📅 Fecha límite:</label>
              <input
                type="date"
                value={c.fecha || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "fecha", e.target.value || null)
                }
                style={{ width: "100%", padding: "5px" }}
              />
            </div>

            {/* 👤 Responsable */}
            <div style={{ marginBottom: "10px" }}>
              <label>👤 Responsable:</label>
              <input
                value={c.responsable || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "responsable", e.target.value)
                }
                style={{ width: "100%", padding: "5px" }}
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
