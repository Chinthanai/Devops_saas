import { Users, Server, Activity, AlertCircle, BrainCircuit } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Total Employees', stat: '2', icon: Users, color: 'text-blue-500' },
    { name: 'Active Services', stat: '4', icon: Server, color: 'text-green-500' },
    { name: 'System Health', stat: '98%', icon: Activity, color: 'text-purple-500' },
    { name: 'Incident Count', stat: '1', icon: AlertCircle, color: 'text-red-500' },
    { name: 'AI Analysis Runs', stat: '142', icon: BrainCircuit, color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((item) => (
          <div key={item.name} className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{item.stat}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Kubernetes Status (Mock)</h3>
          <div className="space-y-4">
            {['gateway-service', 'auth-service', 'employee-service', 'aiops-service'].map((svc) => (
              <div key={svc} className="flex items-center justify-between">
                <span className="text-gray-300">{svc}-deployment</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900 text-green-300">
                  Running (2/2)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-gray-300">New employee record added</p>
                <p className="text-xs text-gray-500">10 mins ago</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500"></div>
              <div>
                <p className="text-gray-300">AI analysis completed for req #12</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-red-500"></div>
              <div>
                <p className="text-gray-300">High CPU alert triggered on auth-service</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
