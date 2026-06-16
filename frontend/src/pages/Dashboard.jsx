import { useEffect, useState } from 'react';
import client from '../api/client';
import { Users, Server, Activity, AlertCircle, BrainCircuit, RefreshCcw } from 'lucide-react';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [empRes, incRes, metRes] = await Promise.all([
        client.get('/api/employees/employees'),
        client.get('/api/aiops/incidents'),
        client.get('/api/aiops/metrics/summary'),
      ]);
      setEmployees(empRes.data);
      setIncidents(incRes.data);
      setMetrics(metRes.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openIncidents = incidents.filter(i => i.status !== 'Resolved').length;
  const systemHealth = openIncidents === 0 ? '100%' : '98%';
  const stats = [
    { name: 'Total Employees', stat: employees.length, icon: Users, color: 'text-blue-500' },
    { name: 'Incident Count', stat: openIncidents, icon: AlertCircle, color: 'text-red-500' },
    { name: 'AI Analysis Runs', stat: metrics?.aiAnalysisCount ?? '…', icon: BrainCircuit, color: 'text-yellow-500' },
    { name: 'Active Services', stat: '4', icon: Server, color: 'text-green-500' },
    { name: 'System Health', stat: systemHealth, icon: Activity, color: 'text-purple-500' },
  ];

  return (
    loading ? (
      <div className="p-6 text-center text-gray-400">Loading dashboard...</div>
    ) : error ? (
      <div className="p-6 text-center text-red-400">{error}</div>
    ) : (
      <>
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

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mt-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Kubernetes Status (Mock)</h3>
            <div className="space-y-4">
              {['gateway-service', 'auth-service', 'employee-service', 'aiops-service'].map((svc) => (
                <div key={svc} className="flex items-center justify-between">
                  <span className="text-gray-300">{svc}-deployment</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900 text-green-300">
                    Running
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
            {incidents.length === 0 ? (
              <p className="text-gray-400">No recent activity</p>
            ) : (
              <ul className="space-y-4">
                {incidents.slice(0, 5).map((inc) => (
                  <li key={inc.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 mt-2 rounded-full ${inc.severity === 'High' ? 'bg-red-500' : inc.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                    <div>
                      <p className="text-gray-300">{inc.title}</p>
                      <p className="text-xs text-gray-500">{new Date(inc.created_at).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => {
            setLoading(true);
            fetchData();
          }} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <RefreshCcw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </>
    )
  );
}
