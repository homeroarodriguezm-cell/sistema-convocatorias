import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  // ✅ CARGAR DATOS
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

  // ✅ CREAR NUEVA
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

    if (!error) cargarConvocatorias();

    setNombre("");
  };

  // ✅ ACTUALIZAR DATOS
  const actualizarCampo = async (id, campo, valor) => {
    // actualizar visualmente
    const copia = convocatorias.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );
    setConvocatorias(copia);

    // guardar en BD
    await supabase
      .from("convocatorias")
      .update({ [campo]: valor })
      .eq("id", id);
  };

  // ✅ MÉTRICAS
  const totalConvocatorias = convocatorias.length;

  const totales = {
    USD: 0,
    EUR: 0,
    Bs: 0
  };

  convocatorias.forEach(c => {
    const valor = parseFloat(c.financiamiento);
    if (!isNaN(valor)) {
      if (c.moneda === "USD") totales.USD += valor;
      if (c.moneda === "EUR") totales.EUR += valor;
      if (c.moneda === "Bs") totales.Bs += valor;
    }
  });

  const totalConFecha = convocatorias.filter(c => c.fecha).length;

  return (
    <div style={{
      padding: "30px",
      fontFamily: "Arial",
      background: "#f5f5f5",
      minHeight: "100vh"
    }}>

      <h1>Sistema de Convocatorias 📊</h1>

      {/* ✅ DASHBOARD */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
      }}>

        <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
          <h3>📊 Total convocatorias</h3>
          <p>{totalConvocatorias}</p>
        </div>

        <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
          <h3>💰 Financiamiento</h3>
          <p>USD: ${totales.USD.toLocaleString()}</p>
          <p>EUR: €{totales.EUR.toLocaleString()}</p>
          <p>Bs: Bs {totales.Bs.toLocaleString()}</p>
        </div>

        <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
          <h3>📅 Con fecha</h3>
          <p>{totalConFecha}</p>
        </div>

      </div>

      {/* ✅ CREAR */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la convocatoria"
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      {/* ✅ TARJETAS */}
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

            <div style={{ marginBottom: "10px" }}>
              <label>💰 Financiamiento:</label>
              <input
                value={c.financiamiento || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "financiamiento", e.target.value)
                }
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>💱 Moneda:</label>
              <select
                value={c.moneda || "USD"}
                onChange={(e) =>
                  actualizarCampo(c.id, "moneda", e.target.value)
                }
                style={{ width: "100%" }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="Bs">Bs</option>
              </select>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>🧠 Área:</label>
              <input
                value={c.area || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "area", e.target.value)
                }
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>📅 Fecha límite:</label>
              <input
                type="date"
                value={c.fecha || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "fecha", e.target.value || null)
                }
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>👤 Responsable:</label>
              <input
                value={c.responsable || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "responsable", e.target.value)
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
