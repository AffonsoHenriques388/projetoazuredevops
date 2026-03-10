/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

export interface IComentarioConsultaObject {
  id?: string;
  COMPLAINEREMAIL?: string;
  INVOLVEDS?: any;
  PREVIOUSKNOWLAGE?: any;
  SUSPECTBUSINESSROLE?: string;
  SUSPECTDEPARTMENT?: string;
  PROTOCOL?: string;
  FILE?: any;
  STATUS?: number;
  CREATEDON?: string;
  COMPLAIERNAME?: string;
  COMPLAINERPHONENUMBER?: string | number;
  SUSPECTNAME?: string;
  COMPLAINTTYPE?: string;
  LOCATION?: string;
  STILLHAPPENING?: boolean;
  HASOMISSION?: number;
  PREVIOUSNAME?: string;
  FACTDATE?: string;
  PREVIOUSROLE?: string;
  COMPLAINTTEXT?: string;
  ATTACHMENT?: { ATTACHMENT: any; LINK: any } | any;
  Comment?: string;
  CREATEDBY?: any;
  COMMENT?: any;
  ATTACHMENTS?: { ATTACHMENT: string; LINK: string } | string;
  uploadFiles?: any;
}

export interface IComentarioConsultaContext {
  data: IComentarioConsultaObject[];
  setData: React.Dispatch<React.SetStateAction<IComentarioConsultaObject[]>>;
  addNewData: (data: IComentarioConsultaObject) => void;
  deleteData: (
    data: IComentarioConsultaObject | IComentarioConsultaObject[],
  ) => void;
  editData: (index: number, newData: IComentarioConsultaObject) => void;
}
export const ComentarioConsultaContext =
  createContext<IComentarioConsultaContext>({} as IComentarioConsultaContext);

interface IReactChildren {
  children: ReactNode | ReactNode[];
}
// eslint-disable-next-line react-refresh/only-export-components
export function ComentarioConsultaProvider({ children }: IReactChildren) {
  const [data, setData] = useState<IComentarioConsultaObject[]>([]);

  const addNewData = useCallback((newData: IComentarioConsultaObject) => {
    const updateData = setData((prevData) => [...prevData, newData]);
    return updateData;
  }, []);

  const deleteData = (
    itemsToDelete: IComentarioConsultaObject | IComentarioConsultaObject[],
  ) => {
    setData((prevData) => {
      const itemsToDeleteArray = Array.isArray(itemsToDelete)
        ? itemsToDelete
        : [itemsToDelete];
      return prevData.filter((item) => !itemsToDeleteArray.includes(item));
    });
  };

  const editData = (index: number, newData: IComentarioConsultaObject) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = newData;
      return updatedData;
    });
  };

  return (
    <ComentarioConsultaContext.Provider
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
    </ComentarioConsultaContext.Provider>
  );
}

export const useComentarioConsultaContext = (): IComentarioConsultaContext => {
  const context = useContext(ComentarioConsultaContext);
  if (!context) {
    throw new Error(
      'useComentarioConsultaContext must be used within a ComentarioConsultaContext',
    );
  }
  return context;
};
