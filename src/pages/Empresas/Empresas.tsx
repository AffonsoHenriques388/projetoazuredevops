/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-var */
import React from 'react';
import { Typography } from 'antd';
import { API_BASE, API_URL } from '../../API/apiManager';
import Default from '../../components/Default/Default';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Avatar,
  Pagination,
  TableContainer,
} from '@mui/material';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import { AiOutlineSearch } from 'react-icons/ai';
import CriarEmpresa from './CriarEmpresa';
import EditarEmpresa from './EditarEmpresa';
import DeleteEmpresa from './DeleteEmpresa';
import { getThemeColors } from '../../themeColors';

interface GetCompany {
  dataIndex: React.Key | null | undefined;
  CNPJ?: string | null;
  IDCOMPANY?: number | null;
  RAZAOSOCIAL?: string | null;
  CREATEDBY?: string | null;
  CREATEDON?: string | null;
  DEFAULTRESOLUTIONTIME: number | null;
  BAIRRO?: string | null;
  CEP?: string | null;
  CIDADE?: string | null;
  COMPLEMENTO?: string | null;
  ENDERECO?: string | null;
  NUMENDERECO?: string | null;
  UF?: string | null;
}

export default function Empresas() {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const [data, setData] = React.useState<GetCompany[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [copyData, setCopyData] = React.useState<GetCompany[]>(data);
  const [loading, setLoading] = React.useState(false);

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentData = data.slice(startIndex, endIndex);

  React.useEffect(() => {
    const options = {
      headers: {
        Base: API_BASE,
        Accept: 'application/json',
      },
    };
    setLoading(true);
    axios
      .get<GetCompany[]>(API_URL + `/companies`, options)
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Erro no GET.', error);
      });
  }, []);

  // console.log(data);

  const requestSearch = (search: string) => {
    setCopyData(data.filter((item) => item.CNPJ?.includes(search)));
  };

  const options = {
    headers: {
      Base: API_BASE,
      Accept: 'application/json',
    },
  };

  const updateData = () => {
    setLoading(true);

    axios
      .get<GetCompany[]>(API_URL + `/companies`, options)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Erro na atualização dos dados.', error);
        setLoading(false);
      });
  };

  const getToken = sessionStorage.getItem('tokeRBAC');

  // console.log(getToken);
  if (getToken !== null) {
    var token = JSON.parse(atob(getToken.split('.')[1]));
  }
  const isAdmin = token.user_access;

  // console.log(isAdmin);

  return (
    <Default>
      <div className="flex justify-center">
        <Typography.Title
          level={2}
          className={`font-inter ${tertiaryColor} md:mt-3 mt-0`}
        >
          Empresas
        </Typography.Title>
      </div>
      {isAdmin === 'ADMIN' ? (
        <div className="flex justify-end">
          <CriarEmpresa data={data} updateData={updateData} />
        </div>
      ) : null}
      <div
        className="flex flex-row p-3 w-full mt-3 outline-none rounded-lg"
        style={{ border: '2px solid rgba(188, 188, 188, 0.90)' }}
      >
        {' '}
        <AiOutlineSearch size={20} className={`${tertiaryColor} mr-3`} />
        <input
          style={{ border: 'none' }}
          className="outline-none w-full"
          placeholder="Procurar Empresa..."
          type="search"
          onChange={(e) => requestSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="flex justify-center mt-3">
          <Loading />
        </div>
      ) : currentData.length === 0 ? (
        <p>Nenhuma empresa cadastrada.</p>
      ) : (
        <div>
          <TableContainer
            className="bg-transparent mt-3"
            component={Paper}
            elevation={0}
            style={{ maxHeight: 500 }}
          >
            <Table className=" bg-transparent">
              <TableHead className="bg-gray-30">
                <TableRow
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0,
                      backgroundColor: 'rgb(241 245 249)',
                    },
                  }}
                >
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">CNPJ</TableCell>
                  <TableCell align="center">Razão Social</TableCell>
                  <TableCell align="center">Prazo Padrão</TableCell>
                  <TableCell align="center">Criação Usuário</TableCell>
                  <TableCell align="center">Data de Inclusão</TableCell>
                  {isAdmin === 'ADMIN' ? (
                    <TableCell align="center">Ações</TableCell>
                  ) : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {!!currentData?.length ? (
                  (copyData?.length > 0 ? copyData : currentData).map(
                    (company) => {
                      const dataIndex = startIndex + data.indexOf(company);
                      return (
                        <TableRow key={dataIndex} hover={true}>
                          <TableCell align="center">{company?.IDCOMPANY}</TableCell>
                          <TableCell align="center">
                            {company?.CNPJ?.replace(/\D/g, '').replace(
                              /^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/,
                              '$1.$2.$3/$4-$5',
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {company.RAZAOSOCIAL}
                          </TableCell>
                          <TableCell align="center">
                            {company.DEFAULTRESOLUTIONTIME}
                          </TableCell>

                          <TableCell align="center">
                            {company.CREATEDBY}
                          </TableCell>
                          <TableCell align="center">
                            {company.CREATEDON}
                          </TableCell>

                          {isAdmin === 'ADMIN' ? (
                            <TableCell align="center">
                              <div className="flex md:flex-row flex-col md:gap-1 gap-0 justify-center">
                                <div>
                                  <EditarEmpresa
                                    company={company}
                                    updateData={updateData}
                                  />
                                  <DeleteEmpresa
                                    company={company}
                                    updateData={updateData}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          ) : null}
                        </TableRow>
                      );
                    },
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Nenhum dado disponível
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center mt-3">
            {!!data.length && (
              <Pagination
                variant="outlined"
                color="primary"
                count={Math.ceil(data.length / 10)}
                page={currentPage}
                onChange={handleChangePage}
                showFirstButton
                showLastButton
              />
            )}
          </div>
        </div>
      )}
    </Default>
  );
}
