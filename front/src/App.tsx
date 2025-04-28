import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginFrom';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PlanningDashboard from './components/PlanningDashboard/PlanningDashboard';
import PedagogicalDashboard from './components/PedagogicalDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        {/* Protected for STUDENT */}
        <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} role="STUDENT" />} />

        {/* Protected for ADMIN */}
        <Route path="/admin-dashboard" element={<ProtectedRoute Component={PlanningDashboard} role="ADMIN" />} />

        {/* Protected for PROFESSOR */}
        <Route path="/professor-dashboard" element={<ProtectedRoute Component={PedagogicalDashboard} role="PROFESSOR" />} />
      </Routes>
    </Router>
  );
};

export default App;
