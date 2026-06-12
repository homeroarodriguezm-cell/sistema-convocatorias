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

  // ✅ Agregar convocatoria
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

  // ✅ FIX REAL
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

  // ✅ MÉTRICAS
  const total = convocatorias.length;

  return (
    <div style={{
      padding: "30px",
      fontFamily: "Arial",
      background: "#f5f5f5",
      minHeight: "100vh"
    }}>

      <h1 style={{ marginBottom: "20px" }}>
        Sistema de Convocatorias 📊
      </h1>

      {/* ✅ DASHBOARD */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "25px"
      }}>

        <div style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}>
          <h4>Total convocatorias</h4>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>{total}</p>
        </div>

      </div>

      {/* ✅ CREAR */}
      <div style={{ marginBottom: "25px" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la convocatoria"
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={agregar}
          style={{
            padding: "10px 15px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Agregar
        </button>
      </div>

      {/* ✅ TARJETAS PRO */}
      <div style={{
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))"
      }}>
        {convocatorias.map((c) => (
          <div
            key={c.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
            }}
          >

            {/* NOMBRE */}
            <input
              value={c.nombre || ""}
              onChange={(e) =>
                actualizarCampo(c.id, "nombre", e.target.value)
              }
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                width: "100%",
                marginBottom: "12px"
              }}
            />

            {/* CAMPOS */}
            <div style={{ marginBottom: "10px" }}>
              <label>🏢 Organización</label>
              <input
                value={c.organizacion || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "organizacion", e.target.value)
                }
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>📌 Estatus</label>
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

            <div style={{ marginBottom: "10px" }}>
              <label>💰 Financiamiento</label>
              <input
                value={c.financiamiento || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "financiamiento", e.target.value)
                }
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>💱 Moneda</label>
              <select
                value={c.moneda || "USD"}
                onChange={(e) =>
                  actualizarCampo(c.id, "moneda", e.target.value)
                }
                style={{ width: "100%" }}
              >
                <option>USD</option>
                <option>EUR</option>
                <option>Bs</option>
              </select>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>🔗 Enlace</label>
              <input
                value={c.link || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "link", e.target.value)
                }
                style={{ width: "100%" }}
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
``
