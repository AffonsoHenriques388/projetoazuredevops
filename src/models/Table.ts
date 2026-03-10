/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, ReactNode } from "react";

export interface TableColumn {
  field: string;
  headerName: string;
  fieldMask?: (field: any) => string;
  width?: number;
  customValue?: ReactElement;
}

export interface TableProps<T> {
  columns: TableColumn[];
  data?: T[];
  checkboxSelection?: boolean;
  handleSelectedRow?: (value: T[]) => void;
  canEdit?: boolean;
  handleEdit?: (value: T) => void;
  canExclude?: boolean;
  handleExclude?: (value: T | T[]) => void;
  tableHandleExclude?: (value: T | T[]) => void;
  canView?: boolean;
  handleView?: (value: T | T[]) => void;
  handleSwitch?: (value: T | T[]) => void;
  allowed?: boolean;
  initial?: boolean;
  pageSize?: number;
}
