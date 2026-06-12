import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombre, setNombre] = useState("");

  // Cargar datos
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

  // Agregar
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
      console.error("ERROR INSERT:", error);
    } else {
      cargarConvocatorias();
    }

    setNombre("");
  };

  // Actualizar
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

