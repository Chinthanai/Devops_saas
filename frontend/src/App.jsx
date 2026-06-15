import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Incidents from './pages/Incidents';
import DashboardLayout from './layouts/DashboardLayout';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="incidents" element={<Incidents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
