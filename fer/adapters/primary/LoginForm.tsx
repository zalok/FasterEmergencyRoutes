"use client";

import { useState } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await login(email, password);
      console.log("Login exitoso:", data);
      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err: any) {
      alert(err?.message || String(err));
      console.error("Error en login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Iniciar Sesión
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-lg p-3 text-white transition active:scale-95 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
      </form>

      {/* Enlaces */}
      <div className="mt-4 space-y-2 text-center text-sm text-gray-500">
        <div>
          <a href="#" className="hover:text-blue-600">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div>
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-green-600 hover:text-green-700">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}