/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

// Defina a estrutura do contexto
interface AuthContextData {
  protocol: string[] | any;
  password: string[] | any;
  logo: string[] | any;
  disclaimer: string[] | any | string;
  setProtocol: (value: string[]) => void;
  setPassword: (value: string[]) => void;
  setLogo: (value: string[]) => void;
  setDisclaimer: (value: string[] | string) => void;
  decodeToken: (value: string[] | number[] | string | number | any) => void;
  setDecodeToken: (value: string[] | number[] | string | number | any) => void;
}

// Crie o contexto
const AuthContext = createContext<AuthContextData | undefined>(undefined);

// Provedor de contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [protocol, setProtocol] = useState<string[] | any>([]);
  const [password, setPassword] = useState<string[]>([]);
  const [logo, setLogo] = useState<string[]>([]);
  const [disclaimer, setDisclaimer] = useState<string[] | any | string>([]);
  const [decodeToken, setDecodeToken] = useState<
    string[] | number[] | string | number | any
  >([]);

  return (
    <AuthContext.Provider
      value={{
        protocol,
        password,
        setProtocol,
        setPassword,
        logo,
        setLogo,
        disclaimer,
        setDisclaimer,
        decodeToken,
        setDecodeToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Crie um hook personalizado para acessar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
