"use client";

interface StatsGridProps {
  stats: {
    totalIncidents: number;
    activeIncidents: number;
    resolvedToday: number;
    responseTime: string;
  };
}

export default function StatsGrid({ stats }: StatsGridProps) {
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
}