import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Matieres from './pages/Matieres';
import Enseignants from './pages/Enseignants';
import Groupes from './pages/Groupes';
import Planning from './pages/Planning';

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/matieres" element={<Matieres />} />
          <Route path="/enseignants" element={<Enseignants />} />
          <Route path="/groupes" element={<Groupes />} />
          <Route path="/planning" element={<Planning />} />
        </Routes>
      </Layout>
    </Router>
  );
}
