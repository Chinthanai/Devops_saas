import { AlertTriangle, Activity, Database, ServerCrash } from 'lucide-react';

export default function Incidents() {
  const incidents = [
    {
      id: 'INC-1042',
      title: 'High CPU Usage on Auth Service',
      service: 'auth-service',
      severity: 'High',
      time: '15 mins ago',
      icon: Activity,
      color: 'text-red-500'
    },
    {
      id: 'INC-1041',
      title: 'Database Read Latency Spike',
      service: 'postgres-db',
      severity: 'Medium',
      time: '2 hours ago',
      icon: Database,
      color: 'text-yellow-500'
    },
    {
      id: 'INC-1040',
      title: 'Pod CrashLoopBackOff',
      service: 'payment-gateway',
      severity: 'Critical',
      time: '5 hours ago',
      icon: ServerCrash,
      color: 'text-red-600'
    }
  ];

  const severityColors = {
    High: 'bg-red-900/50 text-red-300 border-red-800',
    Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-800',
    Critical: 'bg-red-600 text-white border-red-500 font-bold',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="text-red-500" size={28} />
        <h2 className="text-2xl font-bold text-white">Active Incidents</h2>
      </div>

      <div className="grid gap-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-gray-800 rounded-lg border border-gray-700 p-5 flex items-start sm:items-center flex-col sm:flex-row gap-4 transition-all hover:bg-gray-750">
            <div className={`p-3 rounded-full bg-gray-900 ${incident.color}`}>
              <incident.icon size={24} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <span className="text-sm font-mono text-gray-400">{incident.id}</span>
                <span className={`px-2 py-0.5 text-xs rounded border ${severityColors[incident.severity]}`}>
                  {incident.severity}
                </span>
              </div>
              <h3 className="text-lg font-medium text-white">{incident.title}</h3>
              <p className="text-sm text-gray-400 mt-1">Affected Service: <span className="font-mono text-gray-300">{incident.service}</span></p>
            </div>
            
            <div className="flex flex-col items-end justify-center">
              <span className="text-sm text-gray-400">{incident.time}</span>
              <button className="mt-2 text-sm text-blue-400 hover:text-blue-300">View Details &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
