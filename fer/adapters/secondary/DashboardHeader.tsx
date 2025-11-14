"use client";

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function DashboardHeader({ activeTab, onTabChange, onLogout }: DashboardHeaderProps) {
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
}