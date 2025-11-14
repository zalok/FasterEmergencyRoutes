"use client";

interface QuickActionsProps {
  onCreateIncident: () => void;
  onViewRoutes: () => void;
}

export default function QuickActions({ onCreateIncident, onViewRoutes }: QuickActionsProps) {
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
}