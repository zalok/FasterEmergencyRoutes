"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { useRouter } from "next/navigation";

// Tipo para el incidente simulado
type MockIncident = {
  id: string;
  title: string;
  address: string;
  priority: "Alta" | "Media" | "Baja";
};

export default function DashboardPage() {
  const router = useRouter();

  // Estado de la UI
  const [driverStatus, setDriverStatus] = useState("available");
  const [activeIncident, setActiveIncident] = useState<MockIncident | null>(null);

  useEffect(() => {
    if (driverStatus === "available" && !activeIncident) {
      const timer = setTimeout(() => {
        setActiveIncident({
          id: "inc-123",
          title: "¡Nuevo Incidente!",
          address: "Av. Providencia con Tobalaba",
          priority: "Alta",
        });
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [driverStatus, activeIncident]);


  const acceptIncident = () => {
    setDriverStatus("busy"); // Cambia el estado a ocupado
    setActiveIncident(null); // Cierra el aviso
    alert("Ruta aceptada. Estado cambiado a 'Ocupado'.");
  };

  const rejectIncident = () => {
    setActiveIncident(null);
  };


  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-700">
      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-2xl font-bold">
        [ Simulación de Mapa en Pantalla Completa ]
      </div>
      <div 
        className={`absolute top-0 left-0 right-0 z-20 p-4 bg-white shadow-lg transition-transform duration-500 ease-in-out ${
          activeIncident ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-2xl font-bold text-red-600">{activeIncident?.title}</h3>
          <p className="text-gray-700 text-lg mt-1">{activeIncident?.address}</p>
          <p className="font-semibold text-gray-900">Prioridad: {activeIncident?.priority}</p>
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={acceptIncident}
              className="flex-1 rounded-lg bg-blue-600 p-3 text-white font-bold transition hover:bg-blue-700 active:scale-95"
            >
              Aceptar Ruta
            </button>
            <button
              onClick={rejectIncident}
              className="flex-1 rounded-lg bg-gray-300 p-3 text-gray-800 font-medium transition hover:bg-gray-400"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <button
          onClick={() => setDriverStatus("available")}
          className={`py-2 px-4 rounded-full font-semibold shadow-md transition-all ${
            driverStatus === "available"
              ? "bg-green-500 text-white scale-110 border-2 border-white" // Resaltado si está activo
              : "bg-white/80 backdrop-blur-sm text-gray-900"
          }`}
        >
          Disponible
        </button>
        <button
          onClick={() => setDriverStatus("busy")}
          className={`py-2 px-4 rounded-full font-semibold shadow-md transition-all ${
            driverStatus === "busy"
              ? "bg-yellow-500 text-white scale-110 border-2 border-white"
              : "bg-white/80 backdrop-blur-sm text-gray-900"
          }`}
        >
          Ocupado
        </button>
        <button
          onClick={() => setDriverStatus("offline")}
          className={`py-2 px-4 rounded-full font-semibold shadow-md transition-all ${
            driverStatus === "offline"
              ? "bg-gray-600 text-white scale-110 border-2 border-white"
              : "bg-white/80 backdrop-blur-sm text-gray-900"
          }`}
        >
          Offline
        </button>
      </div>

      {/* Botón de Logout (Arriba-Izquierda) */}
      <button
        className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-white active:scale-95"
      >
        Salir
      </button>

    </div>
  );
}