import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Matieres from './pages/Matieres';
import Enseignants from './pages/Enseignants';
import Groupes from './pages/Groupes';
import Planning from './pages/Planning';
import Login from './pages/Login';
import Profile from './pages/Profile';
import useAuthStore from './store/authStore';
import Cours from './pages/Cours';
import Salles from './pages/Salles';
import Utilisateurs from './pages/Utilisateurs';

interface RouteWrapperProps {
  children: ReactElement;
}

function PrivateRoute({ children }: RouteWrapperProps): ReactElement {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function PublicRoute({ children }: RouteWrapperProps): ReactElement {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}

function PrivateLayout(): ReactElement {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route element={
          <PrivateRoute>
            <PrivateLayout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="matieres" element={<Matieres />} />
          <Route path="enseignants" element={<Enseignants />} />
          <Route path="groupes" element={<Groupes />} />
          <Route path="planning" element={<Planning />} />
          <Route path="emploi-du-temps" element={<Planning />} />
          <Route path="cours" element={<Cours />} />
          <Route path="salles" element={<Salles />} />
          <Route path="utilisateurs" element={<Utilisateurs />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
