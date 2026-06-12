import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import logo from "./logo.png";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const cargarConvocatorias = async () => {
    const { data, error } = await supabase
      .from("convocatorias")
      .select("*");

    if (!error) setConvocatorias(data || []);
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

    setNombre("");
    cargarConvocatorias();
  };

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

  // ✅ filtro con área incluido
  const convocatoriasFiltradas = convocatorias.filter(c =>
    (c.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.organizacion || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.estatus || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.responsable || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.area || "").toLowerCase().includes(busqueda.toLowerCase())
  );

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
      background: "#007AAE",
      minHeight: "100vh",
      fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h1 style={{ color: "white", margin: 0 }}>
          Sistema de Convocatorias
        </h1>

        {logo}
      </div>

      <div style={{
        background: "white",
        padding: "25px",
        borderRadius: "16px"
      }}>

        {/* DASHBOARD */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px"
        }}>
          <div style={{
            background: "#F9FAFB",
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
            background: "#F9FAFB",
            padding: "20px",
            borderRadius: "12px"
          }}>
            <h3>📅 Próximas</h3>
            {proximas.map(c => (
              <p key={c.id}>
                {c.nombre} → {c.fecha}
              </p>
            ))}
          </div>
        </div>

        {/* BUSCADOR */}
        <div style={{ marginBottom: "20px" }}>
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, organización, área, responsable o estatus..."
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px"
            }}
          />
        </div>

        {/* CREAR */}
        <div style={{ marginBottom: "20px" }}>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nueva convocatoria"
            style={{ padding: "10px", marginRight: "10px" }}
          />
          <button
            onClick={agregar}
            style={{
              background: "#007AAE",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "6px"
            }}
          >
            Agregar
          </button>
        </div>

        {/* TARJETAS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px"
        }}>
          {convocatoriasFiltradas.map(c => (
            <div key={c.id} style={{
              background: "#F9FAFB",
              padding: "20px",
              borderRadius: "12px",
              borderLeft: `6px solid ${colorEstatus(c.estatus)}`
            }}>

              <input
                value={c.nombre || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "nombre", e.target.value)
                }
                style={{ width: "100%", fontWeight: "bold", marginBottom: "10px" }}
              />

              <label>Organización</label>
              <input
                value={c.organizacion || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "organizacion", e.target.value)
                }
                style={{ width: "100%" }}
              />

              <label>Responsable</label>
              <input
                value={c.responsable || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "responsable", e.target.value)
                }
                style={{ width: "100%" }}
              />

              {/* ✅ NUEVO CAMPO ÁREA */}
              <label>Área</label>
              <input
                value={c.area || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "area", e.target.value)
                }
                style={{ width: "100%" }}
              />

              <label>Estatus</label>
              <select
                value={c.estatus}
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

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <input
                  placeholder="Monto"
                  value={c.financiamiento || ""}
                  onChange={(e) =>
                    actualizarCampo(c.id, "financiamiento", e.target.value)
                  }
                  style={{ flex: 1 }}
                />

                <select
                  value={c.moneda}
                  onChange={(e) =>
                    actualizarCampo(c.id, "moneda", e.target.value)
                  }
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>Bs</option>
                </select>
              </div>

              <label>Fecha</label>
              <input
                type="date"
                value={c.fecha || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "fecha", e.target.value)
                }
                style={{ width: "100%" }}
              />

              <label>Enlace</label>
              <input
                value={c.link || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "link", e.target.value)
                }
                style={{ width: "100%" }}
              />

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
