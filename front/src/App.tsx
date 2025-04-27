import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginFrom';
import Dashboard from './components/Dashboard.tsx';
import ProtectedRoute from './components/ProtectedRoute';  // Custom ProtectedRoute component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} role="STUDENT" />} />
      </Routes>
    </Router>
  );
};

export default App;
