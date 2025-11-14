"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { useRouter } from "next/navigation";

type Incident = {
  id: string;
  title: string;
  address: string;
  priority: "Alta" | "Media" | "Baja";
};

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8000/api/incidents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar incidentes");
        return res.json();
      })
      .then((data) => setIncidents(data.incidents))
      .catch((err) => console.error(err));
  }, [token, router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Cerrar sesión
      </button>
      <ul>
        {incidents.map((incident) => (
          <li key={incident.id} className="mb-2 p-4 border rounded">
            <h2 className="text-xl font-semibold">{incident.title}</h2>
            <p>{incident.address}</p>
            <p>Prioridad: {incident.priority}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}