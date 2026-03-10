/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

export interface IAtoLesivoObject {
  COMPLAINT?: string;
  id?: number;
  IDCOMPLAINTTYPE?: any;
  RESOLUTIONTIME?: number;
}

export interface IAtoLesivoContext {
  data: IAtoLesivoObject[];
  setData: React.Dispatch<React.SetStateAction<IAtoLesivoObject[]>>;
  addNewData: (data: IAtoLesivoObject) => void;
  deleteData: (data: IAtoLesivoObject | IAtoLesivoObject[]) => void;
  editData: (index: number, newData: IAtoLesivoObject) => void;
}
export const AtoLesivoContext = createContext<IAtoLesivoContext>(
  {} as IAtoLesivoContext,
);

interface IReactChildren {
  children: ReactNode | ReactNode[];
}
// eslint-disable-next-line react-refresh/only-export-components
export function AtoLesivoProvider({ children }: IReactChildren) {
  const [data, setData] = useState<IAtoLesivoObject[]>([]);

  const addNewData = useCallback((newData: IAtoLesivoObject) => {
    const updateData = setData((prevData) => [...prevData, newData]);
    return updateData;
  }, []);

  const deleteData = (itemsToDelete: IAtoLesivoObject | IAtoLesivoObject[]) => {
    setData((prevData) => {
      const itemsToDeleteArray = Array.isArray(itemsToDelete)
        ? itemsToDelete
        : [itemsToDelete];
      return prevData.filter((item) => !itemsToDeleteArray.includes(item));
    });
  };

  const editData = (index: number, newData: IAtoLesivoObject) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = newData;
      return updatedData;
    });
  };

  return (
    <AtoLesivoContext.Provider
      value={{
        data,
        setData,
        // isModalOpen,
        // setModalOpen,
        addNewData,
        deleteData,
        editData,
      }}
    >
      {children}
    </AtoLesivoContext.Provider>
  );
}

export const useAtoLesivoContext = (): IAtoLesivoContext => {
  const context = useContext(AtoLesivoContext);
  if (!context) {
    throw new Error(
      'useAtoLesivoContext must be used within a AtoLesivoContext',
    );
  }
  return context;
};
