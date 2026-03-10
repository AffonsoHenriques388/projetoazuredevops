/* eslint-disable @typescript-eslint/no-explicit-any */
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeSistema from './pages/HomeSistema/HomeSistema';
import React from 'react';
import Customizacoes from './pages/Customizacoes/Customizacoes';
import Denuncias from './pages/Denuncias/Denuncias';
import Empresas from './pages/Empresas/Empresas';

interface PrivateProps {
  Item: React.ComponentType<any>;
}

export default function HomeRoutes() {
  const Private: React.FC<PrivateProps> = ({ Item }) => {
    const token = sessionStorage.getItem('tokeRBAC');
    // console.log(token);
    if (token) {
      return <Item />;
    } else {
      // getSession().catch(() => {
      window.location.assign('/admin/login');
      // });
      return <Navigate to="/admin/login" />;
    }
  };

  return (
    <Routes>
      <Route path="/home" element={<Private Item={HomeSistema} />} />
      <Route path="/empresas" element={<Empresas />} />
      <Route path="/denuncias" element={<Denuncias />} />
      <Route path="/customizacoes" element={<Customizacoes />} />
    </Routes>
  );
}
