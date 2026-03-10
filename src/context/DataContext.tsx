/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

interface DataProps {
  LINK?: string;
  ATTACHMENT?: string;
  COMMENT?: string;
  CREATEDON?: string;
  IDCOMENT?: number;
  CREATEDBY?: string;
}

interface PropsData {
  data: DataProps[];
  setData: React.Dispatch<React.SetStateAction<DataProps[]>>;
  addNewData: (data: DataProps) => void;
}
const DataContext = createContext<PropsData | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataProps[]>([]);

  const addNewData = useCallback((newData: DataProps) => {
    const updateData = setData((prevData) => [...prevData, newData]);
    return updateData;
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, addNewData }}>
      {children}
    </DataContext.Provider>
  );
};

const useDataContext = (): PropsData => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataContext');
  }
  return context;
};
export { DataProvider, useDataContext };
