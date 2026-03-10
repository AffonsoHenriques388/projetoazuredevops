/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { API_BASE, API_URL } from '../API/apiManager';
import axios from 'axios';

interface LogoProps {
  link: string | undefined;
}

interface LogoPropsData extends LogoProps {
  data: (data: LogoProps) => void;
}
const LogoContext = createContext<LogoPropsData | undefined>(undefined);

const LogoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiCalled, setApiCalled] = useState(false);
  const [logoData, setLogoData] = useState<LogoProps>(() => {
    const storedData = sessionStorage.getItem('logoData');
    return storedData
      ? JSON.parse(storedData)
      : {
          link: '',
        };
  });

  useEffect(() => {
    if (!apiCalled) {
      callAPI();
      setApiCalled(true);
    }

    const intervalTimer = setInterval(callAPI, 50 * 60 * 1000);

    return () => {
      clearInterval(intervalTimer);
    };
  }, []);

  const callAPI = async () => {
    const options = {
      Base: API_BASE,
      Accept: 'application/json',
    };

    try {
      await axios
        .get(API_URL + '/admin/customizations', { headers: options })
        .then((response) => {
          const logoDataFromApi = response.data.body[0];
          const logoDataToUpdate: LogoProps = {
            link: logoDataFromApi.LOGO_LINK,
          };
          setLogoData(logoDataToUpdate);
          sessionStorage.setItem('logoData', JSON.stringify(logoDataToUpdate));
        });
    } catch (error) {
      console.error(error);
    }
  };

  const data = useCallback((data: LogoProps) => {
    if (data) {
      setLogoData((prevLogoData) => {
        const updatedData = { ...prevLogoData, ...data };
        sessionStorage.setItem('logoData', JSON.stringify(updatedData));
        return updatedData;
      });
    }
  }, []);

  const logoContextValue = useMemo(
    () => ({
      ...logoData,
      data,
    }),
    [logoData, data],
  );

  return (
    <LogoContext.Provider value={logoContextValue}>
      {children}
    </LogoContext.Provider>
  );
};

const useContextLogo = (): LogoPropsData => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useContextLogo deve ser usado dentro de um LogoContext');
  }
  return context;
};

export { LogoProvider, useContextLogo };
