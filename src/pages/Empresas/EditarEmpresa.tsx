/* eslint-disable no-var */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from 'antd';
import React, { FormEvent, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import LayoutModal from '../../components/Modal/Modal';
import useModal from '../../components/Modal/useModal';
import { MdModeEditOutline } from 'react-icons/md';
import Warning from '../../assets/aviso.svg';
import {
  FormControl,
  Box,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TableContainer,
  IconButton,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
  Snackbar,
  Autocomplete,
} from '@mui/material';
import InputSecondary from '../../components/Input/InputSecondary';
import { API_BASE, API_URL } from '../../API/apiManager';
import axios from 'axios';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Loading from '../../components/Loading/Loading';
import { getThemeColors } from '../../themeColors';
import {
  IAtoLesivoContext,
  useAtoLesivoContext,
  IAtoLesivoObject,
} from '../../context/AtoLesivoContext';
import { MdEdit } from 'react-icons/md';
import { AutoCompleteComponentNameString } from '../../components/Input/AutoComplete';
import { CriarTipologia } from './CriarTipologia';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 490,
  maxWidth: '100%',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  // border: '2px solid #000',
  // boxShadow: 24,
  p: 4,
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditarEmpresa({ company, updateData }: any) {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const { open, toggle } = useModal();

  const [openTipologias, setOpenTipologias] = React.useState(false);
  const [openDeleteTipologias, setOpenDeleteTipologias] =
    useState<boolean>(false);
  const handleOpenTipologias = () => setOpenTipologias(true);
  const handleCloseTipologias = () => setOpenTipologias(false);
  const [tipologias, setTipologias] = React.useState<any[]>([]);
  const [IDComplaintType, setIDComplaintType] = React.useState<string | null>(
    null,
  );
  const [atoLesivo, setAtoLesivo] = React.useState<any[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [tipologiaDeletar, setTipologiaDeletar] = useState<any>();
  const [openEditarTipologia, setOpenEditarTipologia] =
    useState<boolean>(false);
  const [tipologiaEditar, setTipologiaEditar] = useState<any>();

  const handleOpenEditarTipologias = (tipologia: any) => {
    setTipologiaEditar(tipologia);
    setOpenEditarTipologia(true);
  };
  // console.log(tipologiaEditar, 'editra');

  const handleCloseEditarTipologias = () => setOpenEditarTipologia(false);

  // console.log(tipologiaDeletar, 'deletar');
  const handleOpenDeleteTipologias = (tipologia: any) => {
    setTipologiaDeletar(tipologia);
    setOpenDeleteTipologias(true);
  };

  const handleCloseDeleteTipologias = () => setOpenDeleteTipologias(false);

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  const [filteredData, setFilteredData] = useState(tipologias);
  //função que lida com o change do select de ato lesivo
  const handleFilterChange = (value: string | null, _name: string | null) => {
    // console.log(value);
    setIDComplaintType(value);

    const filtered = tipologias.filter((tipologia) =>
      tipologia.COMPLAINT?.toLowerCase().includes(value?.toLowerCase() || ''),
    );

    setFilteredData(filtered);
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
  };

  // console.log(IDComplaintType);
  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;

  const currentData =
    filteredData.length > 0
      ? filteredData.slice(startIndex, endIndex)
      : tipologias.slice(startIndex, endIndex);

  const [empresa, setEmpresa] = React.useState({
    DEFAULTRESOLUTIONTIME: company.DEFAULTRESOLUTIONTIME,
    CNPJ: company.CNPJ,
    RAZAOSOCIAL: company.RAZAOSOCIAL,
    BAIRRO: company.BAIRRO,
    CEP: company.CEP,
    CIDADE: company.CIDADE,
    COMPLEMENTO: company.COMPLENDERECO,
    ENDERECO: company.ENDERECO,
    NUMENDERECO: company.NUMENDERECO,
    UF: company.UF,
  });

  // console.log(empresa);
  // console.log(atoLesivo);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openSnackError, setOpenSnackError] = React.useState(false);

  const handleCloseError = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackError(false);
  };

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const handleChangeText = (fieldName: string, value: string) => {
    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      [fieldName]: value,
    }));
  };

  // console.log(empresa);

  //POPULA AUTOCOMPLETE
  React.useEffect(() => {
    const options = {
      headers: {
        Base: API_BASE,
        Accept: 'application/json',
      },
    };
    axios.get(API_URL + '/complaints/types', options).then((response) => {
      // console.log(response.data);

      const result = response.data.map(
        (item: {
          IDCOMPLAINTTYPE: number;
          COMPLAINT: string;
          CREATEDBY: string;
          CREATEDON: string;
        }) => ({
          id: String(item.IDCOMPLAINTTYPE),
          name: item.COMPLAINT,
          CREATEDBY: item.CREATEDBY,
          CREATEDON: item.CREATEDON,
        }),
      );
      setAtoLesivo(result);
    });
  }, []);

  //POPULA TABELA
  React.useEffect(() => {
    const options = {
      headers: {
        Base: API_BASE,
        Accept: 'application/json',
        IDCOMPANY: company.IDCOMPANY,
      },
    };

    const response = axios
      .get(API_URL + '/companies/tipology', options)
      .then((response) => {
        const result = response.data.body;
        setTipologias(result);
      });
  }, [company.IDCOMPANY, setTipologias]);

  // console.log(tipologias);
  //PEGA TOKENRBAC DO SESSION STORAGE
  const getToken = sessionStorage.getItem('tokeRBAC');

  if (getToken !== null) {
    var token = JSON.parse(atob(getToken.split('.')[1]));
  }
  //EMAIL QUE PASSA EM POST, PUT E AFINS
  const user = token.username;

  //PUT DE EMPRESAS
  const handlePutCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const headers = {
      Base: API_BASE,
      cep: empresa.CEP,
      endereco: empresa.ENDERECO,
      numendereco: empresa.NUMENDERECO,
      complendereco: empresa.COMPLEMENTO,
      bairro: empresa.BAIRRO,
      uf: empresa.UF,
      cidade: empresa.CIDADE,
      cnpjcompany: empresa.CNPJ,
      razaosocial: empresa.RAZAOSOCIAL,
      user: user,
      defaultresolutiontime: empresa.DEFAULTRESOLUTIONTIME,
      Accept: 'application/json',
    };

    const options: any = {
      method: 'PUT',
      headers: headers,
      redirect: 'follow',
      url: `${API_URL}/companies`,
    };
    // console.log(headers);

    try {
      const response = await axios(options).then((response) => {
        // console.log(response.data.statusCode);
        if (response.data.statusCode === 200) {
          setLoading(false);
          setOpenSnack(true);

          setTimeout(() => {
            updateData();
          }, 2000);
        } else {
          setOpenSnackError(true);
          setLoading(false);
        }
      });
      // console.log(response);
    } catch (error) {
      setOpenSnackError(true);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const options = {
        headers: {
          Base: API_BASE,
          Accept: 'application/json',
          IDCOMPANY: company.IDCOMPANY,
        },
      };

      const response = await axios.get(
        API_URL + '/companies/tipology',
        options,
      );
      // console.log(response.data.body);

      setTipologias(response.data.body);
    } catch (error) {
      console.error('Erro ao buscar tipologias:', error);
    }
  };

  // console.log(IDComplaintType);
  // // console.log(tipologiaEditar);

  //PUT TIPOLOGIA
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append('BASE', API_BASE);
    myHeaders.append('IDCOMPANY', company.IDCOMPANY);
    myHeaders.append('RESOLUTIONTIME', tipologiaEditar?.RESOLUTIONTIME);
    myHeaders.append('USER', user);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      ComplaintName: tipologiaEditar?.COMPLAINT,
    });

    const requestOptions: object = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    console.log(requestOptions);
    fetch(API_URL + '/companies/tipology', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        fetchData();
        console.log(result);
        if (result.statusCode === 200) {
          setOpenSnack(true);
          fetchData();
        }
      })
      .catch((_error) => {
        setOpenSnackError(true);
      });
  };

  // console.log(tipologiaDeletar?.IDCOMPLAINTTYPE, 'id complaint');
  // console.log(company.IDCOMPANY, 'company');

  //DELETE TIPOLOGIA

  const handleDelete = (e: FormEvent) => {
    e.preventDefault();
    const myHeaders = new Headers();

    myHeaders.append('BASE', API_BASE);
    myHeaders.append('IDCOMPANY', company.IDCOMPANY);
    myHeaders.append('TIPOLOGYID', tipologiaDeletar?.IDCOMPLAINTTYPE);
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions: object = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    };
    fetch(API_URL + '/companies/tipology', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        if (result.statusCode === 200) {
          fetchData();
          setOpenDeleteTipologias(false);
          setOpenSnack(true);
        }
      })
      .catch((_error) => setOpenSnackError(true));
  };

  return (
    <>
      <Snackbar
        className="font-inter"
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Sucesso!
        </Alert>
      </Snackbar>

      <Snackbar
        className="font-inter"
        open={openSnackError}
        autoHideDuration={3000}
        onClick={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClick={handleCloseError}
          severity="error"
          sx={{ width: '100%' }}
        >
          ERRO! Caso persista entre em contato com o suporte!
        </Alert>
      </Snackbar>
      <IconButton onClick={toggle} type="button">
        <MdModeEditOutline size={20} className={`${tertiaryColor}`} />
      </IconButton>
      <LayoutModal open={open} onClose={toggle}>
        <Typography.Title
          level={2}
          className={`font-inter ${tertiaryColor} md:mt-3 mt-0`}
        >
          Editar Empresa
        </Typography.Title>
        <form onSubmit={handlePutCompany} action="PUT" id="putForm">
          <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
            <FormControl fullWidth>
              <InputSecondary
                placeholder="CNPJ"
                className="inputProtocolo font-inter"
                id="CNPJ-empresa"
                name="CNPJ"
                value={empresa.CNPJ?.replace(/\D/g, '').replace(
                  /^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/,
                  '$1.$2.$3/$4-$5',
                )}
                onChange={(value) => handleChangeText('CNPJ', value)}
                disabled={true}
                iconStart={undefined}
              />
              <FormHelperText>CNPJ</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <InputSecondary
                placeholder="Nome da Empresa"
                className="inputProtocolo font-inter"
                id="nome-empresa"
                iconStart={undefined}
                name="RAZAOSOCIAL"
                value={empresa.RAZAOSOCIAL}
                onChange={(value) => handleChangeText('RAZAOSOCIAL', value)}
              />
              <FormHelperText>Razão Social</FormHelperText>
            </FormControl>
          </div>
          <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
            <FormControl fullWidth>
              <InputSecondary
                placeholder="CEP"
                required={false}
                className="inputProtocolo font-inter"
                id="CEP-empresa"
                name="CEP"
                value={empresa.CEP}
                onChange={(value) => handleChangeText('CEP', value)}
                iconStart={undefined}
              />
              <FormHelperText>CEP</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <InputSecondary
                placeholder="Rua"
                className="inputProtocolo font-inter"
                id="rua-empresa"
                required={false}
                iconStart={undefined}
                value={empresa.ENDERECO}
                onChange={(value) => handleChangeText('ENDERECO', value)}
                name="ENDERECO"
              />
              <FormHelperText>Rua</FormHelperText>
            </FormControl>
          </div>
          <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
            <FormControl fullWidth>
              <InputSecondary
                placeholder="Número"
                className="inputProtocolo font-inter"
                id="numero-empresa"
                required={false}
                iconStart={undefined}
                value={empresa.NUMENDERECO}
                onChange={(value) => handleChangeText('NUMENDERECO', value)}
                name="NUMENDERECO"
              />
              <FormHelperText>Número</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <InputSecondary
                required={false}
                placeholder="Complemento"
                className="inputProtocolo font-inter"
                id="complemento-empresa"
                iconStart={undefined}
                onChange={(value) => handleChangeText('COMPLEMENTO', value)}
                value={empresa.COMPLEMENTO}
                name="COMPLEMENTO"
              />
              <FormHelperText>Complemento</FormHelperText>
            </FormControl>
          </div>
          <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
            <FormControl fullWidth>
              <InputSecondary
                required={false}
                placeholder="Cidade"
                className="inputProtocolo font-inter"
                id="cidade-empresa"
                iconStart={undefined}
                value={empresa.CIDADE}
                onChange={(value) => handleChangeText('CIDADE', value)}
                name="CIDADE"
              />
              <FormHelperText>Cidade</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <InputSecondary
                required={false}
                placeholder="Estado"
                className="inputProtocolo font-inter"
                id="estado-empresa"
                iconStart={undefined}
                value={empresa.UF}
                onChange={(value) => handleChangeText('UF', value)}
                name="UF"
              />
              <FormHelperText>Estado</FormHelperText>
            </FormControl>
          </div>
          <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
            <FormControl fullWidth>
              <InputSecondary
                required={false}
                placeholder="Prazo padrão em dias para resolução da Denúncia"
                value={empresa.DEFAULTRESOLUTIONTIME}
                className="inputProtocolo font-inter"
                name="DEFAULTRESOLUTIONTIME"
                id="prazo-padrao-empresa"
                iconStart={undefined}
                onChange={(value) =>
                  handleChangeText('DEFAULTRESOLUTIONTIME', value)
                }
              />
              <FormHelperText>Prazo Padrão em dias</FormHelperText>
            </FormControl>
          </div>
        </form>
        <div className="mt-3">
          <FormControl fullWidth>
            <button
              type="button"
              className={`${primaryColor} text-white rounded shadow py-2 px-3`}
              onClick={handleOpenTipologias}
            >
              Gerenciar Tipologias
            </button>

            <Modal
              open={openTipologias}
              onClose={handleCloseTipologias}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div>
                  <Typography className="font-inter text-lg font-semibold md:text-md text-gray200 mb-4 text-center">
                    Gerencias Tipologias
                  </Typography>{' '}
                  <FormControl fullWidth>
                    {' '}
                    <div className="flex justify-center flex-col gap-1">
                      <AutoCompleteComponentNameString
                        options={atoLesivo}
                        onChange={(_event, value) =>
                          handleFilterChange(value, 'COMPLAINT')
                        }
                        label="Tipologias cadastradas"
                      />
                    </div>
                  </FormControl>
                  <div className="mt-3">
                    <CriarTipologia
                      company={company}
                      fetchData={fetchData}
                      user={user}
                    />
                  </div>
                  <TableContainer
                    className="bg-transparent mt-3"
                    component={Paper}
                    elevation={0}
                    style={{ maxHeight: 590 }}
                  >
                    <Table size="small">
                      <TableHead className="bg-gray30">
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': {
                              border: 0,
                              backgroundColor: 'rgb(241 245 249)',
                            },
                          }}
                        >
                          <TableCell>Nome da Tipologia</TableCell>
                          <TableCell>Prazo</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentData.map((tipologia) => {
                          // console.log(currentData);

                          return (
                            <TableRow key={tipologia.IDCOMPLAINTTYPE}>
                              <TableCell>{tipologia.COMPLAINT}</TableCell>
                              <TableCell>{tipologia.RESOLUTIONTIME}</TableCell>

                              <TableCell
                                align="center"
                                className="flex flex-row"
                              >
                                <IconButton
                                  aria-label="edit"
                                  onClick={() =>
                                    handleOpenEditarTipologias(tipologia)
                                  }
                                >
                                  <MdModeEditOutline />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() =>
                                    handleOpenDeleteTipologias(tipologia)
                                  }
                                >
                                  <IoIosClose />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box display="flex" justifyContent="center" my={2}>
                    <Pagination
                      count={Math.ceil(
                        (filteredData.length > 0
                          ? filteredData.length
                          : tipologias.length) / 5,
                      )}
                      page={currentPage}
                      onChange={handleChangePage}
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                </div>
              </Box>
            </Modal>
          </FormControl>
        </div>

        {/* modal delete tipologia */}
        <Modal
          open={openDeleteTipologias}
          onClose={handleCloseDeleteTipologias}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography className="font-inter text-lg font-semibold md:text-md text-gray200 mb-4 text-center">
              Excluir Tipologia
            </Typography>{' '}
            <form id="deleteForm">
              <div className="flex justify-center mb-3">
                <img
                  src={Warning}
                  style={{
                    display: 'block',
                    maxWidth: '150px',
                    minWidth: '100px',
                  }}
                />
              </div>
              <p className="font-inter text-gray200 md:text-lg text-center text-base break-words">
                Deseja realmente deletar esta tipologia?{'           '}
                <br />
                <span className={`${tertiaryColor} font-bold`}>
                  {`${tipologiaDeletar?.COMPLAINT.toUpperCase()} -  ${
                    tipologiaDeletar?.RESOLUTIONTIME
                  } dias`}
                </span>
              </p>
              <FormHelperText className="text-center">
                Ao deletar esta tipologia a ação não poderá ser desfeita.
              </FormHelperText>

              <button
                className="p-3 bg-red200 font-inter text-white rounded mt-3 w-full"
                type="submit"
                onClick={handleDelete}
              >
                Deletar
              </button>
            </form>
          </Box>
        </Modal>

        {/* modal editar tipologia */}
        <Modal
          open={openEditarTipologia}
          onClose={handleCloseEditarTipologias}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form action="PUT" onSubmit={onSubmit} id="formPut">
              <Typography className="font-inter text-lg font-semibold md:text-md text-gray200 mb-4 text-center">
                Editar Prazo de Tipologia
              </Typography>{' '}
              <FormControl fullWidth>
                <InputSecondary
                  required={false}
                  placeholder="Nome Tipologia"
                  className="inputProtocolo font-inter"
                  id="nome-tipologia"
                  iconStart={undefined}
                  disabled
                  value={tipologiaEditar?.COMPLAINT}
                  onChange={(value) =>
                    setTipologiaEditar({
                      ...tipologiaEditar,
                      COMPLAINT: value,
                    })
                  }
                  name="Nome-Tipologia"
                />
                <FormHelperText>Nome Tipologia</FormHelperText>
              </FormControl>
              <FormControl fullWidth className="mt-2 mb-4">
                <InputSecondary
                  required={false}
                  placeholder="Prazo Tipologia"
                  className="inputProtocolo font-inter"
                  id="prazo-tipologia"
                  iconStart={undefined}
                  maxLength={2}
                  value={tipologiaEditar?.RESOLUTIONTIME}
                  onChange={(value) =>
                    setTipologiaEditar({
                      ...tipologiaEditar,
                      RESOLUTIONTIME: value,
                    })
                  }
                  name="Prazo-Tipologia"
                />
                <FormHelperText>Prazo Tipologia</FormHelperText>
              </FormControl>
              {loading ? (
                <div className="flex justify-center">
                  <Loading />
                </div>
              ) : (
                <FormControl fullWidth>
                  <button
                    type="submit"
                    className={`${primaryColor} text-white rounded shadow py-2 px-3`}
                    // onClick={}
                  >
                    Salvar Alterações
                  </button>
                </FormControl>
              )}
            </form>
          </Box>
        </Modal>
        {/* <div className="flex justify-center mt-3">
            {loading ? (
              <Loading />
            ) : (
              <FormControl fullWidth>
                <button
                  type="submit"
                  className={`${primaryColor} text-white rounded shadow py-2 px-3`}
                >
                  Salvar
                </button>
              </FormControl>
            )}
          </div> */}
      </LayoutModal>
    </>
  );
}
