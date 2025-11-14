"use client";

interface Incident {
  id: number;
  type: string;
  location: string;
  status: string;
  time: string;
}

interface IncidentListProps {
  incidents: Incident[];
}

export default function IncidentList({ incidents }: IncidentListProps) {
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
        {incidents.map((incident) => (
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
}