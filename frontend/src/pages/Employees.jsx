import { useState, useEffect } from 'react';
import client from '../api/client';
import { UserPlus, Trash2 } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Active');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await client.get('/api/employees/employees');
      setEmployees(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch employees', err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    if (!name || !role) {
      setAddError('Name and role are required');
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      await client.post('/api/employees/employees', { name, role, status });
      // refresh list
      await fetchEmployees();
      setName('');
      setRole('');
      setStatus('Active');
    } catch (err) {
      console.error('Add employee failed', err);
      setAddError('Failed to add employee');
    } finally {
      setAddLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await client.delete(`/api/employees/employees/${id}`);
      await fetchEmployees();
    } catch (err) {
      console.error('Delete employee failed', err);
      setDeleteError('Failed to delete employee');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Employees Directory</h2>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors" onClick={() => document.getElementById('add-emp-form').classList.toggle('hidden')}>
          <UserPlus size={18} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Add Employee Form */}
      <form id="add-emp-form" className="hidden mt-4 bg-gray-800 p-4 rounded-lg border border-gray-700" onSubmit={addEmployee}>
        {addError && <p className="text-sm text-red-400 mb-2">{addError}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Role"
            className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <select
            className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" disabled={addLoading} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
            {addLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      <div className="bg-gray-800 shadow rounded-lg border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading employees...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{emp.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{emp.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{emp.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={
                      emp.status === 'Active'
                        ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300'
                        : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-300'
                    }>{emp.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => deleteEmployee(emp.id)} className="text-red-500 hover:text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
