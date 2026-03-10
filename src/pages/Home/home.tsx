/* eslint-disable @typescript-eslint/no-explicit-any */
import ImgSVG from '../../assets/ActiveSupport.svg';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  FormEvent,
} from 'react';
import './styles.css';
import ButtonPrimary from '../../components/Button/ButtonPrimary';
import InputNewPass from '../../components/Input/InputNewPass';
import { FormControl, FormHelperText } from '@mui/material';
import './styles.css';
import Header from '../../components/Header/Header';
import axios from 'axios';
import { API_BASE, API_URL } from '../../API/apiManager';
import { useAuth } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import LayoutModal from '../../components/Modal/Modal';
import useModal from '../../components/Modal/useModal';
import { Typography } from 'antd';
import ModalDisclaimer from './modalDisclaimer';
import { getThemeColors } from '../../themeColors';
import { useContextLogo } from '../../context/LogoContext';
export default function Home() {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { setProtocol, setDisclaimer, disclaimer } = useAuth();
  const [protocolInput, setProtocolInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [error, setError] = React.useState('');
  const { toggle, open } = useModal();

  const fetchData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    axios
      .get(API_URL + '/complaints/complaint', {
        headers: {
          Base: API_BASE,
          Accept: 'application/json',
          ProtocolNumber: protocolInput,
          ProtocolPassword: passwordInput,
        },
      })
      .then((response) => {
        // console.log(response.data);
        if (response.data.statusCode === 200) {
          // console.log(response.data);
          const protocolValue = response.data.body[0];
          setProtocol(protocolValue);
          navigate('/consultarDenuncia');
          setLoading(false);
        } else {
          setLoading(false);
          setError('Protocolo ou senha inválidos. Digite novamente!');
        }
      });
  };

  useEffect(() => {
    const options = {
      Base: API_BASE,
      Accept: 'application/json',
    };
    axios
      .get(API_URL + '/admin/customizations', { headers: options })
      .then((response) => {
        // console.log(response.data.body[0]);
        setDisclaimer(response.data.body[0].DISCLAIMER);
      });
  }, [disclaimer, setDisclaimer]);
  // console.log(logo);
  const handlePasswordChange = (value: string | any) => {
    setPasswordInput(value);
  };

  const handleProtocolChange = (value: string | any) => {
    setProtocolInput(value);
  };
  const colorSecondaryButton =
    API_BASE === 'estrela'
      ? 'bg-blue500'
      : API_BASE === 'sbaraini'
      ? 'bg-blue'
      : API_BASE === 'localhost'
      ? 'bg-blue'
      : 'bg-blue';

  const hoverSecondaryButton =
    API_BASE === 'estrela'
      ? 'hover:bg-blue500'
      : API_BASE === 'sbaraini'
      ? 'hover:bg-blue'
      : API_BASE === 'localhost'
      ? 'hover:bg-blue'
      : 'hover:bg-blue';

  function changeNameApp(name: string) {
    if (name === 'usj' || name === 'USJ') {
      return (
        <p className="font-roboto text-gray200 text-center text-3xl md:text-5xl mt-10 font-bold">
          Canal de Ética
        </p>
      );
    } else {
      return (
        <p className="font-roboto text-gray200 text-center text-3xl md:text-5xl mt-10 font-bold">
          Canal de Denúncias
        </p>
      );
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col items-center">
          {changeNameApp(API_BASE)}
          <div className="mt-6">
            <Header />
          </div>
          <ModalDisclaimer />
          <form
            onSubmit={fetchData}
            className="p-6 py-4 md:py-8 mt-10 bg-gray100 rounded-lg shadow-lg  md:w-1/2 w-full"
          >
            <div className="flex flex-col items-center p-6 py-5 md:py-10 rounded-md shadow bg-white">
              <p className="font-inter text-gray200 mb-3 md:mb-6">
                Seja bem-vindo(a)!
              </p>{' '}
              <FormControl fullWidth>
                <InputNewPass
                  type="text"
                  id="protocolo"
                  placeholder="nº de protocolo"
                  className="inputProtocolo w-full"
                  value={protocolInput}
                  onChange={handleProtocolChange}
                  iconStart={undefined}
                />
                <div className="mt-3 mb-5 w-full">
                  <InputNewPass
                    type="password"
                    id="senhaProtocolo"
                    placeholder="senha"
                    value={passwordInput}
                    onChange={handlePasswordChange}
                    iconStart={undefined}
                    className="inputProtocolo w-full"
                  />
                </div>
              </FormControl>
              <div className="flex gap-3 mt-3 flex-col w-full">
                <div className="text-center text-red">{error ? error : ''}</div>
                {loading ? (
                  <div className="flex justify-center">
                    <Loading size={30} />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className={`mt-3 ${primaryColor} text-white text-sm md:text-md w-full font-inter py-2 md:py-3 px-2 md:px-4 border-none rounded gap-3`}
                  >
                    Acompanhar Denúncia
                  </button>
                )}

                {/* <a href="/novaDenuncia" rel="noopener noreferrer"> */}
                <ButtonPrimary
                  onClick={toggle}
                  type="button"
                  bgColor={colorSecondaryButton}
                  hoverBgColor={hoverSecondaryButton}
                >
                  Registrar Nova Denúncia
                </ButtonPrimary>
                {/* </a> */}
              </div>
            </div>
          </form>
        </div>
        {/* div 2 */}
        <div className="flex justify-center imgNovaDenuncia">
          <img src={ImgSVG} className="imgMeninaSuporte" />
        </div>
      </div>
      <LayoutModal open={open} onClose={toggle}>
        <Header />
        <Typography.Text className="font-inter text-base mt-3 md:mt-0 mb-3 md:mb-0">
          {disclaimer}
        </Typography.Text>
        <div className="flex justify-center flex-col mt-3">
          <a href="/novaDenuncia" rel="noopener noreferrer">
            <ButtonPrimary
              bgColor={colorSecondaryButton}
              hoverBgColor={hoverSecondaryButton}
            >
              Prosseguir
            </ButtonPrimary>
          </a>
          <FormHelperText className="text-right">
            Powered by{' '}
            <a
              href="https://www.pollvo.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Pollvo 🐙
            </a>
            .
          </FormHelperText>
        </div>
      </LayoutModal>
    </>
  );
}
