"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginSuccess() {
  const [message, setMessage] = useState("Validando token...");
  const [username, setUsername] = useState<string | null>(null);
  const { token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setMessage("Por favor inicia sesión.");
      // Redirigir al login después de un corto tiempo
      setTimeout(() => (window.location.href = "/login"), 1200);
      return;
    }

    fetch("http://localhost:8000/api/validate-token", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error");
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setUsername(data.data.sub || "Usuario");
          setMessage("✅ Inicio de sesión exitoso!");
          // Redirigir al dashboard después de un corto tiempo
          setTimeout(() => router.push("/dashboard"), 1200);
        } else {
          setMessage("Error");
          // Forzar logout y redirección
          logout();
          setTimeout(() => (window.location.href = "/login"), 1200);
        }
      })
      .catch(() => {
        setMessage("Error");
      });
  }, [token, logout, router]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial" }}>
      <h1>{message}</h1>
      {username && <p>Bienvenido, {username}!</p>}
      <div style={{ marginTop: 16 }}>
        <button onClick={() => { logout(); window.location.href = '/login'; }}
          style={{ padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
