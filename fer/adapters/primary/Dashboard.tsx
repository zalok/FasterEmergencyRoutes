"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../core/context/AuthContext";
import { useRouter } from "next/navigation";

// Interfaces locales para evitar problemas de importación
interface Incident {
  id: string;
  type: string;
  location: string;
  status: 'activo' | 'en camino' | 'resuelto';
  severity: 'baja' | 'media' | 'alta' | 'critica';
  description?: string;
  assignedUnit?: string;
  reportedBy?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalIncidents: number;
  activeIncidents: number;
  resolvedToday: number;
  averageResponseTime: string;
}

// Componente EmergencyMap responsivo
const EmergencyMap = ({ incidents }: { incidents: Incident[] }) => {
  const activeIncidents = incidents.filter(inc => inc.status === 'activo');
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Mapa en Tiempo Real</h3>
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <span className="text-xs sm:text-sm text-gray-600">
            {activeIncidents.length} activos
          </span>
          <div className="flex gap-1 sm:gap-2">
            <button className="px-2 py-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Satélite
            </button>
            <button className="px-2 py-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Tráfico
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg h-64 sm:h-80 md:h-96 relative overflow-hidden">
        {/* Renderizar puntos de incidentes reales */}
        {activeIncidents.map((incident, index) => (
          <div
            key={incident.id}
            className={`absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-pulse shadow-lg ${
              incident.severity === 'critica' ? 'bg-red-500' :
              incident.severity === 'alta' ? 'bg-orange-500' :
              incident.severity === 'media' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{
              top: `${20 + (index * 15)}%`,
              left: `${20 + (index * 10)}%`
            }}
          >
            <div className={`absolute -inset-1 rounded-full opacity-75 animate-ping ${
              incident.severity === 'critica' ? 'bg-red-400' :
              incident.severity === 'alta' ? 'bg-orange-400' :
              incident.severity === 'media' ? 'bg-yellow-400' : 'bg-green-400'
            }`}></div>
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white bg-black bg-opacity-50 rounded-lg p-3 sm:p-4 mx-2">
            <p className="text-sm sm:text-lg font-semibold">Mapa de Emergencias</p>
            <p className="text-xs sm:text-sm opacity-80">
              {activeIncidents.length === 0 ? 'No hay incidentes activos' : `Mostrando ${activeIncidents.length} incidentes activos`}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 justify-center sm:justify-start">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
          <span>Crítica</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
          <span>Alta</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
          <span>Media</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
          <span>Baja</span>
        </div>
      </div>
    </div>
  );
};

// Componente IncidentList responsivo
const IncidentList = ({ incidents }: { incidents: Incident[] }) => {
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} h`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Incidentes Recientes</h3>
        <button className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm">
          Ver todos →
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {incidents.slice(0, 5).map((incident) => (
          <div
            key={incident.id}
            className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <div className="text-xl sm:text-2xl flex-shrink-0">
                {getTypeIcon(incident.type)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{incident.type}</h4>
                <p className="text-gray-600 text-xs sm:text-sm truncate">{incident.location}</p>
                <p className="text-gray-500 text-xs">
                  {formatTime(incident.timestamp)}
                  {incident.assignedUnit && ` • ${incident.assignedUnit}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                {incident.status}
              </span>
              <button className="text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        
        {incidents.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            No hay incidentes recientes
          </div>
        )}
      </div>
    </div>
  );
};

// Componente StatsGrid responsivo
const StatsGrid = ({ stats }: { stats: DashboardStats }) => {
  const statCards = [
    {
      title: "Total",
      value: stats.totalIncidents,
      change: "+12%",
      trend: "up",
      icon: "📈",
      color: "blue"
    },
    {
      title: "Activos",
      value: stats.activeIncidents,
      change: "-2",
      trend: "down",
      icon: "🚨",
      color: "red"
    },
    {
      title: "Resueltos",
      value: stats.resolvedToday,
      change: "+3",
      trend: "up",
      icon: "✅",
      color: "green"
    },
    {
      title: "Respuesta",
      value: stats.averageResponseTime,
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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl border-2 p-3 sm:p-4 md:p-6 shadow-sm transition-transform hover:scale-105 hover:shadow-md ${getColorClasses(stat.color)}`}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium opacity-80 truncate">{stat.title}</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">{stat.value}</p>
              <div className={`flex items-center mt-1 sm:mt-2 text-xs sm:text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{stat.change}</span>
                <span className="ml-1">{stat.trend === 'up' ? '↗' : '↘'}</span>
              </div>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl opacity-80 flex-shrink-0 ml-2">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente QuickActions responsivo
const QuickActions = ({ onCreateIncident, onViewRoutes }: any) => {
  const actions = [
    {
      icon: "🚨",
      title: "Nuevo Incidente",
      description: "Reportar emergencia",
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
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Acciones Rápidas</h3>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white rounded-xl p-3 sm:p-4 text-left transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`}
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{action.icon}</div>
            <h4 className="font-semibold text-xs sm:text-sm mb-1 truncate">{action.title}</h4>
            <p className="text-xs opacity-90 hidden xs:block">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// Componente DashboardHeader responsivo
const DashboardHeader = ({ activeTab, onTabChange, onLogout, user }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: "overview", label: "Resumen", icon: "📊" },
    { id: "incidents", label: "Incidentes", icon: "🚨" },
    { id: "routes", label: "Rutas", icon: "🗺️" },
    { id: "reports", label: "Reportes", icon: "📋" },
  ];

  const getEmergencyTypeLabel = (type?: string) => {
    const types: { [key: string]: string } = {
      ambulance: "Ambulancia",
      firefighter: "Bomberos", 
      police: "Policía",
      rescue: "Rescate",
      other: "Otro"
    };
    return type ? types[type] || type : "No especificado";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between sm:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🚑</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">EmergencyRoutes</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🚑</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">EmergencyRoutes</h1>
              <p className="text-gray-500 text-sm">Sistema de Gestión de Emergencias</p>
            </div>
          </div>

          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-gray-800">{user?.name || "Usuario"}</p>
              <p className="text-sm text-gray-500">
                {getEmergencyTypeLabel(user?.emergencyType)}
                {user?.vehicleNumber && ` • ${user.vehicleNumber}`}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden mt-3 space-y-2 border-t border-gray-200 pt-3">
            {/* Mobile Navigation */}
            <nav className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile User Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-center">
                <p className="font-medium text-gray-800">{user?.name || "Usuario"}</p>
                <p className="text-sm text-gray-500">
                  {getEmergencyTypeLabel(user?.emergencyType)}
                  {user?.vehicleNumber && ` • ${user.vehicleNumber}`}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="w-full mt-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Componente UserInfo responsivo
const UserInfo = ({ user }: { user: any }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
        Tu Información
      </h3>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm sm:text-base">Nombre:</span>
          <span className="text-gray-800 font-medium text-sm sm:text-base text-right max-w-[60%] truncate">{user?.name || "No disponible"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm sm:text-base">Email:</span>
          <span className="text-gray-800 text-sm sm:text-base text-right max-w-[60%] truncate">{user?.email || "No disponible"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm sm:text-base">Tipo:</span>
          <span className="text-gray-800 text-sm sm:text-base text-right">
            {user?.emergencyType ? 
              user.emergencyType === 'ambulance' ? 'Ambulancia' :
              user.emergencyType === 'firefighter' ? 'Bomberos' :
              user.emergencyType === 'police' ? 'Policía' :
              user.emergencyType === 'rescue' ? 'Rescate' :
              user.emergencyType === 'other' ? 'Otro' :
              user.emergencyType
            : "No especificado"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm sm:text-base">Vehículo:</span>
          <span className="text-gray-800 text-sm sm:text-base text-right">{user?.vehicleNumber || "No asignado"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm sm:text-base">Estado:</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Disponible
          </span>
        </div>
      </div>
    </div>
  );
};

// Componente principal Dashboard
export default function Dashboard() {
  const { token, logout, incidentApi, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos del dashboard
  useEffect(() => {
    if (!token || authLoading) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Cargar estadísticas e incidentes en paralelo
        const [statsData, incidentsData] = await Promise.all([
          incidentApi.getDashboardStats(),
          incidentApi.getRecentIncidents()
        ]);

        setStats(statsData);
        setRecentIncidents(incidentsData);
      } catch (err: any) {
        console.error("Error cargando datos del dashboard:", err);
        setError(err.message || "Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [token, incidentApi, authLoading]);

  // Redirigir si no hay token
  useEffect(() => {
    if (!token && !authLoading) {
      router.push('/login');
    }
  }, [token, authLoading, router]);

  const handleCreateIncident = async () => {
    try {
      const newIncident = await incidentApi.createIncident({
        type: "Emergencia Médica",
        location: "Ubicación del incidente",
        status: "activo",
        severity: "media",
        description: "Descripción del incidente"
      });
      
      const incidentsData = await incidentApi.getRecentIncidents();
      setRecentIncidents(incidentsData);
      
      alert("Incidente creado exitosamente");
    } catch (err: any) {
      console.error("Error creando incidente:", err);
      setError(err.message || "Error al crear incidente");
    }
  };

  const handleViewRoutes = () => {
    console.log("Ver rutas optimizadas");
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Redirigiendo al login...</h1>
          <p className="text-gray-600">Por favor espera</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar el dashboard</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
            >
              Reintentar
            </button>
            <button 
              onClick={logout}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cerrar Sesión
            </button>
          </div>
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
        user={user}
      />
      
      <main className="p-3 sm:p-4 md:p-6">
        {activeTab === "overview" && (
          <div className="space-y-4 sm:space-y-6">
            {stats && <StatsGrid stats={stats} />}
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                <EmergencyMap incidents={recentIncidents} />
                <IncidentList incidents={recentIncidents} />
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <QuickActions 
                  onCreateIncident={handleCreateIncident}
                  onViewRoutes={handleViewRoutes}
                />
                <UserInfo user={user} />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "incidents" && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Gestión de Incidentes</h2>
            <div className="space-y-3 sm:space-y-4">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{incident.type}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">{incident.location}</p>
                      {incident.description && (
                        <p className="text-gray-500 text-xs mt-2">{incident.description}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ml-2 flex-shrink-0 ${
                      incident.status === 'activo' ? 'bg-red-100 text-red-800' :
                      incident.status === 'en camino' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 sm:mt-3">
                    <span className="text-xs text-gray-500">
                      {incident.assignedUnit && `${incident.assignedUnit} • `}
                      {new Date(incident.timestamp).toLocaleString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      incident.severity === 'critica' ? 'bg-red-500 text-white' :
                      incident.severity === 'alta' ? 'bg-orange-500 text-white' :
                      incident.severity === 'media' ? 'bg-yellow-500 text-black' :
                      'bg-green-500 text-white'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>
              ))}
              {recentIncidents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm sm:text-base">No hay incidentes registrados</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === "routes" && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Rutas de Emergencia</h2>
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">🗺️</div>
              <p className="text-gray-600 text-lg sm:text-xl mb-2">Funcionalidad en desarrollo</p>
              <p className="text-gray-500 text-sm sm:text-base">Próximamente podrás visualizar y optimizar rutas de emergencia</p>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Reportes y Estadísticas</h2>
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">📊</div>
              <p className="text-gray-600 text-lg sm:text-xl mb-2">Módulo en desarrollo</p>
              <p className="text-gray-500 text-sm sm:text-base">Próximamente podrás generar reportes detallados y estadísticas</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}