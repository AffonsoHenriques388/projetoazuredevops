/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import Input from '../../components/Input/Input';
import { useMediaQuery, Theme } from '@mui/material';
import { Button } from 'antd';
import Header from '../../components/Header/Header';
import User from '../../assets/undraw_secure_server_re_8wsq.svg';
import './styles.css';
import axios from 'axios';
import { API_AUTH, API_BASE, API_URL, AUTH_ENV } from '../../API/apiManager';
import { useAuth } from '../../context/UserContext';
import Loading from '../../components/Loading/Loading';
import { getThemeColors } from '../../themeColors';

type Token = {
  access_token?: string;
  app_token?: string;
};

interface TokenProps {
  auth_time?: number;
  client_id?: string;
  event_id?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  jti?: string;
  scope?: string;
  sub?: string;
  token_use?: string;
  username?: string;
  user_access?: string;
}

const Login = () => {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState<Token>({} as Token);
  const [tokenRBAC, setTokenRBAC] = React.useState<TokenProps>({});
  const [error, setError] = React.useState('');

  const isMobile = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('sm');
  });

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // console.log(email, password);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: {
          Username: email,
          Password: password,
        },
      });
      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }

      const result = (await response.json()) as Token;

      // console.log(result);

      setToken(result);

      if (result.access_token) {
        setLoading(false);
        handleToken(result.access_token);
      } else {
        setLoading(false);
        setError('E-mail ou senha incorretos. Verique e tente novamente!');
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const handleToken = async (token: string) => {
    setLoading(true);
    // console.log(token);
    try {
      const headers: any = {
        jwtoken: token,
        appalias: 'CDD',
        env: AUTH_ENV,
        Base: API_BASE.toUpperCase(),
      };
      // console.log(headers);
      const response = await axios.get(`${API_AUTH}/rbac`, { headers });
      // console.log(response.data);

      const result = response.data.app_token;
      // console.log(result);
      const object = JSON.parse(atob(result.split('.')[1]));
      // console.log(result !== undefined, 'cheguei aquiii');
      if (result) {
        setLoading(false);
        const sessionTokenRBAC = sessionStorage.setItem('tokeRBAC', result);

        window.location.href = '/admin/home';
      }

      setTokenRBAC(object);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <div className="mb-10">
        <Header />
      </div>
      <div className="mt-10">
        <p className="text-center font-roboto text-xl text-bold font-normal">
          Sistema de Canal de Denúncias
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="flex justify-center align-center mt-20 flex-row max-h-96"
        >
          <div className="bg-gray100 p-10 rounded shadow-md">
            <div>
              <p className="md:text-xl text-md font-bold text-left font-roboto">
                Login
              </p>
              <p className="text-gray200 text-left text-sm md:text-md font-roboto">
                Faça login em sua conta.
              </p>
              <div className="mt-2">
                <Input
                  className={`text-left md:p-4 p-2 mt-5 rounded-md shadow border ${sixthColor} focus:outline-none focus:ring-1 focus:ring-gray50 font-roboto`}
                  placeholder="e-mail"
                  $inputWidth={isMobile ? '300px' : '410px'}
                  name="emailLogin"
                  value={email}
                  onChange={handleChangeEmail}
                  id="email"
                />
                <Input
                  className={`text-left md:p-4 p-2 mt-5 rounded-md shadow border ${sixthColor} focus:outline-none focus:ring-1 focus:ring-gray50 font-roboto`}
                  placeholder="senha"
                  $inputWidth={isMobile ? '300px' : '410px'}
                  name="senhaLogin"
                  type="password"
                  value={password}
                  onChange={handleChangePassword}
                  id="senha"
                />
                <div className="text-blue font-roboto text-right mt-3 text-sm md:text-md">
                  <a href="/esqueciMinhaSenha">
                    <p>Esqueceu sua senha?</p>
                  </a>
                </div>
                <div className="flex justify-center">
                  <p className="text-red200 text-sm font-roboto text-center mt-2">
                    {error}
                  </p>
                </div>
                <div className="flex justify-center mt-4">
                  {loading ? (
                    <div className="flex justify-center">
                      <Loading />
                    </div>
                  ) : (
                    <button
                      className={`${tertiaryColor} border p-2 rounded-md ${sixthColor} shadow w-full font-roboto`}
                      type="submit"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* img aqui */}
        </form>
        <div className="flex justify-center mt-10 imgMeninaLogin">
          <img src={User} className="imgMeninaSuporte" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
