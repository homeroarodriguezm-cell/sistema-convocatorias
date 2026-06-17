import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import logo from "./logo.png";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const hoy = new Date();

  const cargarConvocatorias = async () => {
    const { data, error } = await supabase
      .from("convocatorias")
      .select("*");

    if (error) {
      console.error("Error al cargar convocatorias:", error);
      return;
    }

    if (data) {
      await revisarVencidas(data);
      setConvocatorias(data);
    }
  };

  const revisarVencidas = async (lista) => {
    for (const c of lista) {
      const vencida = c.fecha && new Date(c.fecha) < hoy;

      if (vencida && c.estatus === "En preparación") {
        const { error } = await supabase
          .from("convocatorias")
          .update({ estatus: "No se participó" })
          .eq("id", c.id);

        if (error) {
          console.error("Error al actualizar estatus vencido:", error);
        } else {
          c.estatus = "No se participó";
        }
      }
    }
  };

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  const agregar = async () => {
    if (!nombre.trim()) return;

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
        link: "",
        proyecto_enviado: "",
        observaciones: ""
      }
    ]);

    if (error) {
      console.error("Error al agregar convocatoria:", error);
      return;
    }

    setNombre("");
    cargarConvocatorias();
  };

  const actualizarCampo = async (id, campo, valor) => {
    const copia = convocatorias.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );

    setConvocatorias(copia);

    const { error } = await supabase
      .from("convocatorias")
      .update({ [campo]: valor })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const convocatoriasFiltradas = convocatorias.filter((c) =>
    (c.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.organizacion || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.estatus || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.responsable || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.area || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.observaciones || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  const convocatoriasOrdenadas = [...convocatoriasFiltradas].sort((a, b) => {
    const fechaA = a.fecha ? new Date(a.fecha) : null;
    const fechaB = b.fecha ? new Date(b.fecha) : null;

    const vencidaA = fechaA && fechaA < hoy;
    const vencidaB = fechaB && fechaB < hoy;

    if (vencidaA !== vencidaB) {
      return vencidaA ? 1 : -1;
    }

    if (fechaA && fechaB) {
      return fechaA - fechaB;
    }

    if (fechaA && !fechaB) return -1;
    if (!fechaA && fechaB) return 1;

    return 0;
  });

  const proximas = convocatorias
    .filter((c) => c.fecha && new Date(c.fecha) >= hoy)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, 3);

  const resumenEstatus = {
    preparacion: convocatorias.filter((c) => c.estatus === "En preparación").length,
    postuladas: convocatorias.filter((c) => c.estatus === "Postulada").length,
    aprobadas: convocatorias.filter((c) => c.estatus === "Aprobada").length,
    rechazadas: convocatorias.filter((c) => c.estatus === "No seleccionada").length,
    noParticipadas: convocatorias.filter((c) => c.estatus === "No se participó").length
  };

  const colorEstatus = (estatus) => {
    switch (estatus) {
      case "En preparación":
        return "#facc15";
      case "Postulada":
        return "#3b82f6";
      case "Aprobada":
        return "#22c55e";
      case "No seleccionada":
        return "#ef4444";
      case "No se participó":
        return "#9ca3af";
      default:
        return "#d1d5db";
    }
  };

  const estiloLabel = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "4px",
    marginTop: "8px",
    color: "#374151"
  };

  const estiloInput = {
    width: "100%",
    padding: "8px 10px",
    marginBottom: "4px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    boxSizing: "border-box"
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#007AAE",
        minHeight: "100vh",
        fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif",
        boxSizing: "border-box"
      }}
    >
      {/* TÍTULO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px"
        }}
      >
        <h1
          style={{
            color: "white",
            margin: 0,
            fontSize: "28px",
            fontWeight: "700"
          }}
        >
          Sistema de Convocatorias
        </h1>

        <img src={logo} alt="Logo" style={{ height: "60px" }} />
      </div>

      {/* CAJA EXPLICATIVA EJECUTIVA */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          padding: "18px 22px",
          borderRadius: "12px",
          marginBottom: "30px",
          maxWidth: "1200px"
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: "16px",
            lineHeight: "1.6",
            margin: 0
          }}
        >
          El Sistema de Convocatorias es una herramienta de seguimiento diseñada
          para centralizar, organizar y dar trazabilidad a las oportunidades de
          financiamiento, alianzas y postulación de proyectos identificadas por la
          institución. Este espacio está dirigido al equipo autorizado involucrado
          en la búsqueda de oportunidades, formulación técnica, revisión y
          seguimiento de postulaciones. Su uso disciplinado permitirá consolidar
          una memoria institucional, mejorar la coordinación interna, anticipar
          fechas clave, fortalecer la calidad del proceso de postulación y
          aumentar la capacidad de respuesta estratégica ante futuras
          convocatorias.
        </p>
      </div>

      {/* PANEL BLANCO */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px"
        }}
      >
        {/* DASHBOARD */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "30px"
          }}
        >
          <div
            style={{
              background: "#F9FAFB",
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <h3 style={{ marginTop: 0 }}>📌 Estatus</h3>
            <p>🟡 {resumenEstatus.preparacion}</p>
            <p>🔵 {resumenEstatus.postuladas}</p>
            <p>🟢 {resumenEstatus.aprobadas}</p>
            <p>🔴 {resumenEstatus.rechazadas}</p>
            <p>⚪ {resumenEstatus.noParticipadas}</p>
          </div>

          <div
            style={{
              background: "#F9FAFB",
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <h3 style={{ marginTop: 0 }}>📅 Próximas</h3>
            {proximas.length === 0 && <p>No hay próximas</p>}
            {proximas.map((c) => (
              <p key={c.id}>
                {c.nombre} → {c.fecha}
              </p>
            ))}
          </div>
        </div>

        {/* BUSCADOR */}
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar..."
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box"
          }}
        />

        {/* AGREGAR NUEVA */}
        <div style={{ marginBottom: "20px" }}>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nueva convocatoria"
            style={{
              padding: "10px",
              marginRight: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
          <button
            onClick={agregar}
            style={{
              background: "#007AAE",
              color: "white",
              padding: "10px 14px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Agregar
          </button>
        </div>

        {/* TARJETAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px"
          }}
        >
          {convocatoriasOrdenadas.map((c) => {
            const vencida = c.fecha && new Date(c.fecha) < hoy;

            const debeOpacar =
              vencida &&
              (c.estatus === "En preparación" ||
                c.estatus === "No se participó" ||
                c.estatus === "No seleccionada");

            return (
              <div
                key={c.id}
                style={{
                  background: "#F9FAFB",
                  padding: "20px",
                  borderRadius: "12px",
                  borderLeft: `6px solid ${colorEstatus(c.estatus)}`,
                  opacity: debeOpacar ? 0.55 : 1
                }}
              >
                <input
                  value={c.nombre || ""}
                  onChange={(e) =>
                    actualizarCampo(c.id, "nombre", e.target.value)
                  }
                  style={{
                    ...estiloInput,
                    fontWeight: "bold",
                    marginBottom: "10px"
                  }}
                />

                <label style={estiloLabel}>Organización</label>
                <input
                  value={c.organizacion || ""}
                  onChange={(e) =>
                    actualizarCampo(c.id, "organizacion", e.target.value)
                  }
                  style={estiloInput}
                />

                <label style={estiloLabel}>Responsable</label>
                <input
                  value={c.responsable || ""}
                  onChange={(e) =>
                    actualizarCampo(c.id, "responsable", e.target.value)
                  }
                  style={estiloInput}
                />

                <label style={estiloLabel}>Área</label>
                <input
                  value={c.area || ""}
                  onChange={(e) =>
                    actualizarCampo(c.id, "area", e.target.value)
                  }
                  style={estiloInput}
                />

                <label style={estiloLabel}>Estatus</label>
                <select
                  value={c.estatus}
                  onChange={(e) =>
                    actualizarCampo(c.id, "estatus", e.target.value)
                  }
                  style={estiloInput}
                >
                  <option>En preparación</option>
                  <option>Postulada</option>
                  <option>Aprobada</option>
                  <option>No seleccionada</option>
                  <option>No se participó</option>
                </select>

                <label style={estiloLabel}>Financiamiento</label>
                <input
                  value={c.financiamiento || ""}
                  onChange={(e) =>
                    actualizarCampo(c.id, "financiamiento", e.target.value)
                  }
                  style={estiloInput}
                  placeholder="Ej. 50.000,00"
                />

                <label style={estiloLabel}>Moneda</label>
                <select
                  value={c.moneda || "USD"}
                  onChange={(e) =>
                    actualizarCampo(c.id, "moneda", e.target.value)
                  }
                  style={estiloInput}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="Bs">Bs</option>
                </select>

                <label style={estiloLabel}>Fecha límite</label>
                <input
                  type="date"
                  value={c.fecha || ""}
                  onChange={(e) =>
                    actualizarCampo(c.id, "fecha", e.target.value)
                  }
                  style={estiloInput}
                />

                <label style={estiloLabel}>Enlace de la convocatoria</label>
                <input
                  value={c.link || ""}
                  onChange={(e) =>
                    actualizarCampo(c.id, "link", e.target.value)
                  }
                  style={estiloInput}
                  placeholder="https://..."
                />

                <label style={estiloLabel}>Proyecto enviado</label>
                <input
                  value={c.proyecto_enviado || ""}
                  onChange={(e) =>
                    actualizarCampo(c.id, "proyecto_enviado", e.target.value)
                  }
                  style={estiloInput}
                  placeholder="https://..."
                />

                <label style={estiloLabel}>Observaciones</label>
                <textarea
                  value={c.observaciones || ""}
                  onChange={(e) =>
                    actualizarCampo(c.id, "observaciones", e.target.value)
                  }
                  placeholder="Ej. No se aplicó por falta de carta aval / propuesta en revisión / queda para próxima cohorte..."
                  style={{
                    ...estiloInput,
                    minHeight: "85px",
                    resize: "vertical",
                    marginBottom: 0
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
