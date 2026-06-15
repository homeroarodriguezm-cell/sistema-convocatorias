import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import logo from "./logo.png";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const hoy = new Date();

  const cargarConvocatorias = async () => {
    const { data } = await supabase
      .from("convocatorias")
      .select("*");

    if (data) {
      await revisarVencidas(data);
      setConvocatorias(data);
    }
  };

  // ✅ AUTOMATIZACIÓN
  const revisarVencidas = async (lista) => {
    for (const c of lista) {
      const vencida = c.fecha && new Date(c.fecha) < hoy;

      if (vencida && c.estatus === "En preparación") {
        await supabase
          .from("convocatorias")
          .update({ estatus: "No se participó" })
          .eq("id", c.id);

        c.estatus = "No se participó";
      }
    }
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

  // ✅ CORREGIDO
  const actualizarCampo = async (id, campo, valor) => {
    const copia = convocatorias.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    );

    setConvocatorias(copia);

    await supabase
      .from("convocatorias")
      .update({ [campo]: valor })
      .eq("id", id);
  };

  // FILTRO
  const convocatoriasFiltradas = convocatorias.filter(c =>
    (c.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.organizacion || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.estatus || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.responsable || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.area || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  // ORDEN
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

    return 0;
  });

  // PRÓXIMAS
  const proximas = convocatorias
    .filter(c => c.fecha && new Date(c.fecha) >= hoy)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, 3);

  const resumenEstatus = {
    preparacion: convocatorias.filter(c => c.estatus === "En preparación").length,
    postuladas: convocatorias.filter(c => c.estatus === "Postulada").length,
    aprobadas: convocatorias.filter(c => c.estatus === "Aprobada").length,
    rechazadas: convocatorias.filter(c => c.estatus === "No seleccionada").length,
    noParticipadas: convocatorias.filter(c => c.estatus === "No se participó").length
  };

  const colorEstatus = (estatus) => {
    switch (estatus) {
      case "En preparación": return "#facc15";
      case "Postulada": return "#3b82f6";
      case "Aprobada": return "#22c55e";
      case "No seleccionada": return "#ef4444";
      case "No se participó": return "#6b7280";
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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <h1 style={{ color: "white" }}>Sistema de Convocatorias</h1>
        <img src={logo} alt="Logo" style={{ height: "60px" }} />
      </div>

      <div style={{ background: "white", padding: "25px", borderRadius: "16px" }}>

        {/* DASHBOARD */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "#F9FAFB", padding: "20px", borderRadius: "12px" }}>
            <h3>📌 Estatus</h3>
            <p>🟡 {resumenEstatus.preparacion}</p>
            <p>🔵 {resumenEstatus.postuladas}</p>
            <p>🟢 {resumenEstatus.aprobadas}</p>
            <p>🔴 {resumenEstatus.rechazadas}</p>
            <p>⚪ {resumenEstatus.noParticipadas}</p>
          </div>

          <div style={{ background: "#F9FAFB", padding: "20px", borderRadius: "12px" }}>
            <h3>📅 Próximas</h3>
            {proximas.length === 0 && <p>No hay próximas</p>}
            {proximas.map(c => (
              <p key={c.id}>{c.nombre} → {c.fecha}</p>
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
            border: "1px solid #ccc"
          }}
        />

        {/* CREAR */}
        <div style={{ marginBottom: "20px" }}>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nueva convocatoria"
            style={{ padding: "10px", marginRight: "10px" }}
          />
          <button onClick={agregar} style={{
            background: "#007AAE",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "6px"
          }}>
            Agregar
          </button>
        </div>

        {/* TARJETAS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px"
        }}>
          {convocatoriasOrdenadas.map(c => {

            const vencida = c.fecha && new Date(c.fecha) < hoy;

            return (
              <div key={c.id} style={{
                background: "#F9FAFB",
                padding: "20px",
                borderRadius: "12px",
                borderLeft: `6px solid ${colorEstatus(c.estatus)}`,
                opacity: vencida ? 0.5 : 1
              }}>

                <input
                  value={c.nombre || ""}
                  onChange={(e) => actualizarCampo(c.id, "nombre", e.target.value)}
                  style={{ width: "100%", marginBottom: "10px", fontWeight: "bold" }}
                />

                <label>Organización</label>
                <input
                  value={c.organizacion || ""}
                  onChange={(e) => actualizarCampo(c.id, "organizacion", e.target.value)}
                  style={{ width: "100%", marginBottom: "5px" }}
                />

                <label>Responsable</label>
                <input
                  value={c.responsable || ""}
                  onChange={(e) => actualizarCampo(c.id, "responsable", e.target.value)}
                  style={{ width: "100%", marginBottom: "5px" }}
                />

                <label>Área</label>
                <input
                  value={c.area || ""}
                  onChange={(e) => actualizarCampo(c.id, "area", e.target.value)}
                  style={{ width: "100%", marginBottom: "5px" }}
                />

                <label>Estatus</label>
                <select
                  value={c.estatus}
                  onChange={(e) => actualizarCampo(c.id, "estatus", e.target.value)}
                  style={{ width: "100%", marginBottom: "10px" }}
                >
                  <option>En preparación</option>
                  <option>Postulada</option>
                  <option>Aprobada</option>
                  <option>No seleccionada</option>
                  <option>No se participó</option>
                </select>

                <input
                  value={c.financiamiento || ""}
                  onChange={(e) => actualizarCampo(c.id, "financiamiento", e.target.value)}
                  style={{ width: "100%", marginBottom: "5px" }}
                />

                <input
                  type="date"
                  value={c.fecha || ""}
                  onChange={(e) => actualizarCampo(c.id, "fecha", e.target.value)}
                  style={{ width: "100%", marginBottom: "5px" }}
                />

                <input
                  value={c.link || ""}
                  onChange={(e) => actualizarCampo(c.id, "link", e.target.value)}
                  style={{ width: "100%" }}
                />

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
