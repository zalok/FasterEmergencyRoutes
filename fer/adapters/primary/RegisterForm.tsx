"use client";

import { useState } from "react";
import { useAuth } from "@/core/context/AuthContext";
import Link from "next/link";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emergencyType, setEmergencyType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await register(name, email, password, emergencyType, vehicleNumber);
      console.log("Registro exitoso:", data);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "/login";
    } catch (err: any) {
      alert(err?.message || String(err));
      console.error("Error en registro:", err);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Crear Cuenta
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input nombre */}
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 
            p-3 text-sm text-gray-700 placeholder-gray-400 
            focus:border-blue-500 focus:bg-white 
            focus:outline-none focus:ring-2 focus:ring-blue-200 
            transition-colors"
            required
          />
        </div>

        {/* Input correo */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 
            p-3 text-sm text-gray-700 placeholder-gray-400 
            focus:border-blue-500 focus:bg-white 
            focus:outline-none focus:ring-2 focus:ring-blue-200 
            transition-colors"
            required
          />
        </div>

        {/* Input contraseña */}
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 
            p-3 text-sm text-gray-700 placeholder-gray-400 
            focus:border-blue-500 focus:bg-white 
            focus:outline-none focus:ring-2 focus:ring-blue-200 
            transition-colors"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.
          </p>
        </div>

        {/* Input tipo de emergencia */}
        <div>
          <label
            htmlFor="emergencyType"
            className="mb-1 block text-sm font-medium text-gray-700">
            Tipo de servicio de emergencia
          </label>
          <select
            id="emergencyType"
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 
            p-3 text-sm text-gray-700 
            focus:border-blue-500 focus:bg-white 
            focus:outline-none focus:ring-2 focus:ring-blue-200 
            transition-colors"
          >
            <option value="">Seleccionar tipo</option>
            <option value="ambulance">Ambulancia</option>
            <option value="firefighter">Bomberos</option>
            <option value="police">Policía</option>
            <option value="rescue">Rescate</option>
            <option value="other">Otro</option>
          </select>
        </div>

        {/* Input número de vehículo */}
        <div>
          <label
            htmlFor="vehicleNumber"
            className="mb-1 block text-sm font-medium text-gray-700">
            Número de vehículo (opcional)
          </label>
          <input
            id="vehicleNumber"
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Número de identificación del vehículo"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 
            p-3 text-sm text-gray-700 placeholder-gray-400 
            focus:border-blue-500 focus:bg-white 
            focus:outline-none focus:ring-2 focus:ring-blue-200 
            transition-colors"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 p-3 text-white transition hover:bg-green-700 active:scale-95"
        >
          Registrarse
        </button>
      </form>

      {/* Enlace para login */}
      <div className="mt-4 text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-700">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}