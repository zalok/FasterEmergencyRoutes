"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { useRouter } from "next/navigation";

// Componentes inline para evitar problemas de importación
const EmergencyMap = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Mapa en Tiempo Real</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Satélite
          </button>
          <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Tráfico
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg h-96 relative overflow-hidden">
        {/* Puntos de incidentes simulados */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg">
          <div className="absolute -inset-1 bg-red-400 rounded-full opacity-75 animate-ping"></div>
        </div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg">
          <div className="absolute -inset-1 bg-red-400 rounded-full opacity-75 animate-ping"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-lg">
          <div className="absolute -inset-1 bg-yellow-400 rounded-full opacity-75 animate-ping"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white bg-black bg-opacity-50 rounded-lg p-4">
            <p className="text-lg font-semibold">Mapa de Emergencias</p>
            <p className="text-sm opacity-80">Mostrando 3 incidentes activos</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Incidente Activo</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>En Camino</span>
        </div>
      </div>
    </div>
  );
};

const IncidentList = ({ incidents }: any) => {
  const getStatusColor = (status: string) => {
    const colors = {
      activo: "bg-red-100 text-red-800 border-red-200",
      "en camino": "bg-yellow-100 text-yellow-800 border-yellow-200",
      resuelto: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      Incendio: "🔥",
      Accidente: "🚗",
      "Emergencia Médica": "🏥",
      Rescate: "🆘",
    };
    return icons[type as keyof typeof icons] || "🚨";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Incidentes Recientes</h3>
        <button className="text-red-600 hover:text-red-700 font-medium text-sm">
          Ver todos →
        </button>
      </div>

      <div className="space-y-4">
        {incidents.map((incident: any) => (
          <div
            key={incident.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">
                {getTypeIcon(incident.type)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{incident.type}</h4>
                <p className="text-sm text-gray-600">{incident.location}</p>
                <p className="text-xs text-gray-500">{incident.time}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                {incident.status}
              </span>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsGrid = ({ stats }: any) => {
  const statCards = [
    {
      title: "Total Incidentes",
      value: stats.totalIncidents,
      change: "+12%",
      trend: "up",
      icon: "📈",
      color: "blue"
    },
    {
      title: "Incidentes Activos",
      value: stats.activeIncidents,
      change: "-2",
      trend: "down",
      icon: "🚨",
      color: "red"
    },
    {
      title: "Resueltos Hoy",
      value: stats.resolvedToday,
      change: "+3",
      trend: "up",
      icon: "✅",
      color: "green"
    },
    {
      title: "Tiempo Respuesta",
      value: stats.responseTime,
      change: "-0.8min",
      trend: "down",
      icon: "⏱️",
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      red: "bg-red-50 border-red-200 text-red-700",
      green: "bg-green-50 border-green-200 text-green-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl border-2 p-6 shadow-sm transition-transform hover:scale-105 hover:shadow-md ${getColorClasses(stat.color)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">{stat.title}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
              <div className={`flex items-center mt-2 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{stat.change}</span>
                <span className="ml-1">{stat.trend === 'up' ? '↗' : '↘'}</span>
              </div>
            </div>
            <div className="text-3xl opacity-80">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const QuickActions = ({ onCreateIncident, onViewRoutes }: any) => {
  const actions = [
    {
      icon: "🚨",
      title: "Nuevo Incidente",
      description: "Reportar nueva emergencia",
      onClick: onCreateIncident,
      color: "bg-red-500 hover:bg-red-600"
    },
    {
      icon: "🗺️",
      title: "Ver Rutas",
      description: "Rutas optimizadas",
      onClick: onViewRoutes,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: "👥",
      title: "Equipos",
      description: "Gestionar recursos",
      onClick: () => console.log("Equipos"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: "📊",
      title: "Reportes",
      description: "Generar reportes",
      onClick: () => console.log("Reportes"),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Acciones Rápidas</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white rounded-xl p-4 text-left transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
            <p className="text-xs opacity-90">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const DashboardHeader = ({ activeTab, onTabChange, onLogout }: any) => {
  const tabs = [
    { id: "overview", label: "Resumen", icon: "📊" },
    { id: "incidents", label: "Incidentes", icon: "🚨" },
    { id: "routes", label: "Rutas", icon: "🗺️" },
    { id: "reports", label: "Reportes", icon: "📋" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🚑</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">EmergencyRoutes</h1>
              <p className="text-gray-500 text-sm">Sistema de Gestión de Emergencias</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-gray-800">Usuario Operador</p>
              <p className="text-sm text-gray-500">Centro de Control</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default function Dashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirigir si no hay token
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const statsData = {
    totalIncidents: 24,
    activeIncidents: 8,
    resolvedToday: 12,
    responseTime: "4.2 min"
  };

  const recentIncidents = [
    { id: 1, type: "Incendio", location: "Av. Principal 123", status: "activo", time: "2 min ago" },
    { id: 2, type: "Accidente", location: "Calle Secundaria 456", status: "en camino", time: "5 min ago" },
    { id: 3, type: "Emergencia Médica", location: "Plaza Central", status: "resuelto", time: "12 min ago" },
    { id: 4, type: "Rescate", location: "Parque Norte", status: "activo", time: "15 min ago" },
  ];

  const handleCreateIncident = () => {
    console.log("Crear nuevo incidente");
  };

  const handleViewRoutes = () => {
    console.log("Ver rutas optimizadas");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Redirigiendo al login...</h1>
          <p className="text-gray-600">Por favor espera</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={logout}
      />
      
      <main className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <StatsGrid stats={statsData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <EmergencyMap />
                <IncidentList incidents={recentIncidents} />
              </div>
              
              <div className="space-y-6">
                <QuickActions 
                  onCreateIncident={handleCreateIncident}
                  onViewRoutes={handleViewRoutes}
                />
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Tu Información
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Disponible
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehículo:</span>
                      <span className="text-gray-800">AMB-001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="text-gray-800">Ambulancia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "incidents" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Incidentes</h2>
            <p className="text-gray-600">Vista detallada de incidentes...</p>
          </div>
        )}
        
        {activeTab === "routes" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Rutas de Emergencia</h2>
            <p className="text-gray-600">Optimización de rutas...</p>
          </div>
        )}
      </main>
    </div>
  );
}