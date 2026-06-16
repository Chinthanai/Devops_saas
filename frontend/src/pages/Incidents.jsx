import { useState, useEffect } from 'react';
import client from '../api/client';
import { AlertTriangle, CheckCircle, XCircle, Plus, Loader2 } from 'lucide-react';

export default function Incidents() {
  // State for incidents data
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('Low');
  const [service, setService] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);

  // Fetch incidents
  const fetchIncidents = async () => {
    try {
      const res = await client.get('/api/aiops/incidents');
      setIncidents(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch incidents', err);
      setError('Unable to load incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Add incident
  const addIncident = async (e) => {
    e.preventDefault();
    if (!title || !service) {
      setAddError('Title and Service are required');
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      await client.post('/api/aiops/incidents', {
        title,
        severity,
        affectedService: service,
      });
      await fetchIncidents();
      setTitle('');
      setService('');
      setSeverity('Low');
      setShowForm(false);
    } catch (err) {
      console.error('Create incident failed', err);
      setAddError('Failed to create incident');
    } finally {
      setAddLoading(false);
    }
  };

  // Resolve incident
  const resolveIncident = async (id) => {
    try {
      await client.patch(`/api/aiops/incidents/${id}/resolve`);
      await fetchIncidents();
    } catch (err) {
      console.error('Resolve incident failed', err);
      setError('Failed to resolve incident');
    }
  };

  // Badge helpers
  const severityColors = {
    Critical: 'bg-red-900/50 text-red-300 border border-red-800',
    High: 'bg-red-700/50 text-red-200 border border-red-600',
    Medium: 'bg-yellow-800/50 text-yellow-300 border border-yellow-700',
    Low: 'bg-green-800/50 text-green-300 border border-green-700',
  };

  const statusBadge = (status) => {
    if (status === 'Resolved') {
      return (
        <span className="px-2 py-0.5 text-xs rounded bg-green-900/50 text-green-300 border border-green-800">
          Resolved
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-xs rounded bg-gray-900/50 text-gray-300 border border-gray-700">
        Open
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <AlertTriangle className="text-red-500" size={28} />
        <h2 className="text-2xl font-bold text-white">Active Incidents</h2>
        <button
          className="ml-auto flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} />
          <span>{showForm ? 'Cancel' : 'Add Incident'}</span>
        </button>
      </div>

      {/* Add Incident Form */}
      {showForm && (
        <form className="bg-gray-800 p-4 rounded border border-gray-700" onSubmit={addIncident}>
          {addError && <p className="text-sm text-red-400 mb-2">{addError}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <input
              type="text"
              placeholder="Affected Service"
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={addLoading}
              className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {addLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              <span>{addLoading ? 'Creating…' : 'Create Incident'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Content */}
      {loading ? (
        <div className="p-6 text-center text-gray-400">Loading incidents…</div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : incidents.length === 0 ? (
        <p className="text-gray-400">No incidents reported.</p>
      ) : (
        <div className="grid gap-4">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-5 flex flex-col md:flex-row items-start md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-mono text-gray-400">#{inc.id}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${severityColors[inc.severity]}`}> {inc.severity} </span>
                  {statusBadge(inc.status)}
                </div>
                <h3 className="text-lg font-medium text-white">{inc.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Affected Service: <span className="font-mono text-gray-300">{inc.affected_service}</span>
                </p>
                {inc.created_at && (
                  <p className="text-xs text-gray-500 mt-1">Created: {new Date(inc.created_at).toLocaleString()}</p>
                )}
              </div>
              {inc.status !== 'Resolved' && (
                <button
                  onClick={() => resolveIncident(inc.id)}
                  className="flex items-center space-x-1 text-green-400 hover:text-green-300"
                >
                  <CheckCircle size={18} />
                  <span>Resolve</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
