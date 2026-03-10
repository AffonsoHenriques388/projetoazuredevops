/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Key } from 'react';
import Default from '../../components/Default/Default';
import { Typography } from 'antd';
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
  Chip,
} from '@mui/material';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import AnalisarDenuncia from './AnalisarDenuncia';
import { AiOutlineSearch } from 'react-icons/ai';
import { API_BASE, API_URL } from '../../API/apiManager';
import { styled } from '@mui/system';
import EnviarDenuncia from './EnviarDenuncia';
import EnviarDenunciaEtica from './EnviarDenunciaEtica';
import EnviarDenunciaFinalizacao from './EnviarDenunciaFinalizacao';
import { getThemeColors } from '../../themeColors';

const StyledChip = styled(Chip)({
  '& .MuiTypography-root': {
    // Estilos para o Typography interno do Chip
    color: '#FFFFFF', // Sua cor de texto
    textShadow: '2px 2px 4px #252525', // Sua sombra de texto
  },
});
interface GetProtocol {
  dataIndex?: React.Key | null | undefined;
  PROTOCOL?: string;
  STATUS?: string | number;
  CREATEDON?: string | number;
  IDCOMPLAINT?: number;
  COMPLAINT?: string;
  DIASEMABERTO?: number;
}

export default function DenunciasCompliance() {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const [data, setData] = React.useState<GetProtocol[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [copyData, setCopyData] = React.useState<GetProtocol[]>(data);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);

    const options = {
      Base: API_BASE,
      Accept: 'application/json',
    };

    axios
      .get(API_URL + '/admin/complaints', { headers: options })
      .then((response) => {
        setData(response.data.body);
        setLoading(false);
      });
  }, []);

  const handleAtt = () => {
    setLoading(true);

    const options = {
      Base: API_BASE,
      Accept: 'application/json',
    };

    axios
      .get(API_URL + '/admin/complaints', { headers: options })
      .then((response) => {
        setData(response.data.body);
        setLoading(false);
      });
  };

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  const getToken = sessionStorage.getItem('tokeRBAC');

  if (getToken !== null) {
    var token = JSON.parse(atob(getToken.split('.')[1]));
  }
  const isAdmin = token.user_access;
  // const isAdmin = 'COMPLIANCE';
  function TypeComplaints(complaint: any, status: number) {
    if (status === 0 && isAdmin === 'COMPLIANCE') {
      //COMPLIANCE
      return <EnviarDenuncia complaint={complaint} handleAtt={handleAtt} />;
    } else if (status === 1 && isAdmin === 'ETHICAL') {
      //ETHICAL
      return (
        <EnviarDenunciaEtica complaint={complaint} handleAtt={handleAtt} />
      );
    } else if (status === 2 && isAdmin === 'COMPLIANCE') {
      //COMPLIANCE
      return (
        <EnviarDenunciaFinalizacao
          complaint={complaint}
          handleAtt={handleAtt}
        />
      );
    } else if (status === 3) {
      return null;
    }
  }

  const filteredData = data.filter((complaint: any) => {
    if (isAdmin === 'ETHICAL') {
      return complaint.STATUS === 1 || complaint.STATUS === 3;
    } else if (isAdmin === 'COMPLIANCE') {
      return (
        complaint.STATUS === 0 ||
        complaint.STATUS === 2 ||
        complaint.STATUS === 3
      );
    } else {
      return true; // For isAdmin === 'ADMIN', show everything
    }
  });

  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentData = filteredData.slice(startIndex, endIndex);

  // console.log(currentData);

  return (
    <Default>
      <div className="flex justify-center">
        <Typography.Title
          level={2}
          className={`font-inter ${tertiaryColor} md:mt-3 mt-0`}
        >
          Denúncias
        </Typography.Title>
      </div>

      {loading ? (
        <div className="flex justify-center mt-3">
          <Loading />
        </div>
      ) : currentData.length === 0 ? (
        <p>Nenhuma denúncia encontrada.</p>
      ) : (
        <div>
          <TableContainer
            className="bg-transparent mt-3"
            component={Paper}
            elevation={0}
            style={{ maxHeight: 640 }}
          >
            <Table className="bg-transparent">
              <TableHead className="bg-gray300">
                <TableRow
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0,
                      backgroundColor: 'rgb(241 245 249)',
                    },
                  }}
                >
                  <TableCell>ID</TableCell>
                  <TableCell align="center">Protocolo</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Tipo de Denúncia</TableCell>
                  <TableCell align="center">Data da Denúncia</TableCell>
                  <TableCell align="center">Tempo em aberto</TableCell>

                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!!filteredData.length &&
                  currentData?.map((complaint: any) => {
                    const dataIndex =
                      startIndex + filteredData.indexOf(complaint);

                    return (
                      <TableRow key={dataIndex} hover={true}>
                        <TableCell>{complaint.IDCOMPLAINT}</TableCell>
                        <TableCell align="center" className="font-bold">
                          {complaint.PROTOCOL}
                        </TableCell>
                        <TableCell align="center">
                          <Stack className="font-bold">
                            <Chip
                              label={
                                <span
                                  style={{
                                    textShadow:
                                      '2px 2px 2px rgba(0, 0,0 ,0.65)',
                                    color: '#FFFFFF',
                                  }}
                                >
                                  {complaint.STATUS === 0
                                    ? 'Em análise'
                                    : complaint.STATUS === 1
                                    ? 'Em Avaliação do Comitê'
                                    : complaint.STATUS === 2
                                    ? 'Em Finalização'
                                    : 'Encerrada'}
                                </span>
                              }
                              color={
                                complaint.STATUS === 0
                                  ? 'error'
                                  : complaint.STATUS === 1
                                  ? 'warning'
                                  : complaint.STATUS === 2
                                  ? 'secondary'
                                  : 'success'
                              }
                            />
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          {complaint.COMPLAINT}
                        </TableCell>
                        <TableCell align="center">
                          {complaint.CREATEDON}
                        </TableCell>
                        <TableCell align="center">
                          {complaint.DIASEMABERTO !== null ? (
                            <p className="font-bold ">
                              {' '}
                              {complaint.DIASEMABERTO} dias
                            </p>
                          ) : (
                            <p className="font-bold text-green">Encerrada</p>
                          )}{' '}
                        </TableCell>

                        <TableCell align="center">
                          <div className="flex justify-center md:flex-row flex-col gap-2">
                            <AnalisarDenuncia complaint={complaint} />
                            {TypeComplaints(complaint, complaint.STATUS)}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center mt-3">
            {!!filteredData.length && (
              <Pagination
                variant="outlined"
                color="primary"
                count={Math.ceil(filteredData.length / 10)}
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
