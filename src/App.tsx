import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from './components/Home/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NovaDenuncia from './pages/NovaDenuncia/NovaDenuncia';
import Login from './pages/LoginSistema/Login';
import ConsultarDenuncia from './pages/ConsultarDenuncia/ConsultarDenuncia';
import EsqueciMinhaSenha from './pages/EsqueciMinhaSenha/EsqueciMinhaSenha';
import { AuthProvider } from './context/UserContext';
import React from 'react';
import Customizacoes from './pages/Customizacoes/Customizacoes';
import Denuncias from './pages/Denuncias/Denuncias';
import Empresas from './pages/Empresas/Empresas';
import HomeRoutes from './HomeRoutes';
import { LogoProvider, useContextLogo } from './context/LogoContext';
import { DataProvider } from './context/DataContext';
import { AtoLesivoProvider } from './context/AtoLesivoContext';
import {
  ComentarioConsultaContext,
  ComentarioConsultaProvider,
} from './context/ComentarioConsultaContext';

const theme = createTheme({
  typography: {
    fontFamily: '"Calibri", sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    secondary: {
      main: '#FFD600',
      contrastText: '#FFFF',
    },
  },
});

function MyRoutes(): JSX.Element {
  const Private: React.FC<{ Item: React.ComponentType }> = ({ Item }) => {
    const token = sessionStorage.getItem('tokeRBAC');
    // console.log(token);

    if (token) {
      return <Item />;
    } else {
      return <Navigate to="admin/login" />;
    }
  };

  // console.log(Private);

  const token = sessionStorage.getItem('tokeRBAC');
  // console.log(token);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="admin/home" element={<HomeSistema />} /> */}
        {/* <Route path="admin/empresas" element={<Empresas />} />
        <Route path="admin/denuncias" element={<Denuncias />} />
        <Route path="admin/customizacoes" element={<Customizacoes />} /> */}

        <Route path="/" element={<Home />} />
        <Route path="/novaDenuncia" element={<NovaDenuncia />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace={true} />} />
        <Route path="/consultarDenuncia" element={<ConsultarDenuncia />} />
        <Route path="/esqueciMinhaSenha" element={<EsqueciMinhaSenha />} />

        <Route
          path="admin/*"
          element={
            token ? (
              <>
                {' '}
                <HomeRoutes />
              </>
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ComentarioConsultaProvider>
          <LogoProvider>
            <AtoLesivoProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <MyRoutes />
              </ThemeProvider>
            </AtoLesivoProvider>
          </LogoProvider>
        </ComentarioConsultaProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
