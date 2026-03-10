import { Typography } from 'antd';
import { API_URL } from '../../API/apiManager';
import Default from '../../components/Default/Default';
import CriarUsuario from './CriarUsuario';
import React, { Key } from 'react';
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
import { AiOutlineSearch } from 'react-icons/ai';
import EditarUsuario from './EditarUsuario';
import DeletarUsuario from './DeletarUsuario';
import VisualizarUsuario from './VisualizarUsuario';
import Loading from '../../components/Loading/Loading';

interface GetUser {
  dataIndex: Key | null | undefined;
  USERNAME?: string;
  UUID?: string;
}
export default function Usuario() {
  const [data, setData] = React.useState<GetUser[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [copyData, setCopyData] = React.useState<GetUser[]>(data);
  const [loading, setLoading] = React.useState(false);

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentData = data?.slice(startIndex, endIndex);

  React.useEffect(() => {
    setLoading(true);
    axios
      .get<GetUser[]>(`https://auth.pollvo.com/dev/management/users/`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((error) => {
        console.log('Erro no GET.', error);
      });
  }, []);

  const requestSearch = (search: string) => {
    setCopyData(data.filter((item) => item.USERNAME?.includes(search)));
  };

  return (
    <Default>
      <div className="flex justify-center">
        <Typography.Title
          level={2}
          className="font-inter text-blue md:mt-3 mt-0"
        >
          Usuários
        </Typography.Title>
      </div>
      <div className="flex justify-end">
        <CriarUsuario />
      </div>
      <div
        className="flex fle-row p-3 w-full mt-3 rounded-md outline-none rounded-lg"
        style={{ border: '2px solid rgba(188, 188, 188, 0.90)' }}
      >
        {' '}
        <AiOutlineSearch size={20} className="text-blue  mr-3 " />
        <input
          style={{ border: 'none' }}
          className="outline-none w-full"
          placeholder="Procurar Usuário..."
          type="search"
          onChange={(e) => requestSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="flex justify-center mt-3">
          <Loading />
        </div>
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
                  <TableCell>Perfil</TableCell>
                  <TableCell align="center">Usuário</TableCell>
                  <TableCell align="center">E-mail</TableCell>
                  <TableCell align="center">Telefone</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!!currentData?.length &&
                  (copyData?.length > 0 ? copyData : currentData).map(
                    (user) => {
                      const dataIndex = startIndex + data?.indexOf(user);
                      return (
                        <TableRow key={dataIndex} hover={true}>
                          <TableCell sx={{ width: '500px' }}>
                            <Stack direction="row" spacing={2}>
                              <Avatar
                                sx={{
                                  backgroundColor: ' rgba(0, 156, 222, 1)',
                                }}
                              >
                                {user.USERNAME?.charAt(0).toUpperCase()}
                              </Avatar>

                              <div>
                                <strong>{user.USERNAME}</strong>
                                <br />
                                <strong>ID:</strong> {user.UUID}
                                <br />
                                <strong>E-mail:</strong> {user.USERNAME}
                              </div>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">{user.USERNAME}</TableCell>
                          <TableCell align="center">{user.USERNAME}</TableCell>
                          <TableCell align="center">{user.USERNAME}</TableCell>
                          <TableCell align="center">
                            <div className="flex md:flex-row flex-col md:gap-1 gap-0">
                              <div>
                                <VisualizarUsuario user={user} />
                              </div>
                              <div>
                                <EditarUsuario user={user} />
                              </div>{' '}
                              <div>
                                <DeletarUsuario user={user} />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    },
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
