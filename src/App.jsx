import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  const cargarConvocatorias = async () => {
    const { data, error } = await supabase
      .from("convocatorias")
      .select("*")
      .order("id", { ascending: false });

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
        financiamiento: "",
        moneda: "USD",
        area: "",
        fecha: null,
        responsable: ""
      }
    ]);

    cargarConvocatorias();
    setNombre("");
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

  // ✅ FUNCIÓN CORREGIDA
  const limpiarNumero = (valor) => {
    if (!valor) return 0;

    // quitar puntos de miles
    const limpio = valor.toString().replace(/\./g, "");

    const numero = parseFloat(limpio);
    return isNaN(numero) ? 0 : numero;
  };

  const totales = {
    USD: 0,
    EUR: 0,
    Bs: 0
  };

  convocatorias.forEach(c => {
    const valor = limpiarNumero(c.financiamiento);

    if (c.moneda === "USD") totales.USD += valor;
    if (c.moneda === "EUR") totales.EUR += valor;
    if (c.moneda === "Bs") totales.Bs += valor;
  });

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>

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

        <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
          <h3>📅 Con fecha</h3>
          <p>{convocatorias.filter(c => c.fecha).length}</p>
        </div>

      </div>

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
          <div key={c.id} style={{ background: "white", padding: "15px", borderRadius: "10px" }}>

            <h3>{c.nombre}</h3>

            <div>
              <label>💰 Financiamiento:</label>
              <input
                value={c.financiamiento || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "financiamiento", e.target.value)
                }
              />
            </div>

            <div>
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

            <div>
              <label>🧠 Área:</label>
              <input
                value={c.area || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "area", e.target.value)
                }
              />
            </div>

            <div>
              <label>📅 Fecha:</label>
              <input
                type="date"
                value={c.fecha || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "fecha", e.target.value || null)
                }
              />
            </div>

            <div>
              <label>👤 Responsable:</label>
              <input
                value={c.responsable || ""}
                onChange={(e) =>
                  actualizarCampo(c.id, "responsable", e.target.value)
                }
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
