/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import ButtonSecondary from '../../components/Button/ButtonSecondary';
import useModal from '../../components/Modal/useModal';
import LayoutModal from '../../components/Modal/Modal';

import { Snackbar, FormControl } from '@mui/material';
import InputSecondary from '../../components/Input/InputSecondary';
import { Input, Typography } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FormHelperText } from '@mui/material';
import { API_BASE, API_URL } from '../../API/apiManager';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import { IoMdClose } from 'react-icons/io';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getThemeColors } from '../../themeColors';
import { cnpj } from 'cpf-cnpj-validator';
import { IoClose } from 'react-icons/io5';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
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

export default function CriarEmpresa({ updateData }: any) {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const { toggle, open } = useModal();
  const [loading, setLoading] = React.useState(false);
  const [CNPJ, setCNPJ] = React.useState('');
  const [razaoSocial, setRazaoSocial] = React.useState('');
  const [prazoPadrao, setPrazoPadrao] = React.useState('');

  const [endereco, setEndereco] = React.useState({
    cep: '',
    rua: '',
    bairro: '',
    numero: '',
    cidade: '',
    complemento: '',
    estado: '',
  });
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

  const handleChange = (fieldName: string, value: string) => {
    setEndereco((prevEndereco) => ({
      ...prevEndereco,
      [fieldName]: value,
    }));
  };

  useEffect(() => {
    if (endereco.cep.length === 8 && !endereco.rua) {
      // Verifica se o campo de rua está vazio para evitar sobrescrita
      axios
        .get(`https://viacep.com.br/ws/${endereco.cep}/json/`)
        .then((response) => {
          setEndereco((prevEndereco) => ({
            ...prevEndereco,
            rua: response.data.logradouro,
            bairro: response.data.bairro,
            cidade: response.data.localidade,
            estado: response.data.uf,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [endereco, endereco.cep]);

  function RemoverCaracteres(value: string) {
    return value.normalize('NFD').replace(/[^a-zA-Z0-9]/g, '');
  }
  function RemoverAcentos(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  const getToken = sessionStorage.getItem('tokeRBAC');

  if (getToken !== null) {
    var token = JSON.parse(atob(getToken.split('.')[1]));
  }

  const user = token.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const headers = {
      Base: API_BASE,
      defaultresolutiontime: prazoPadrao,
      cnpjcompany: CNPJ,
      razaosocial: RemoverAcentos(razaoSocial),
      user: user,
      cep: endereco.cep,
      endereco: RemoverAcentos(endereco.rua),
      numendereco: RemoverAcentos(endereco.numero),
      complendereco: RemoverAcentos(endereco.complemento),
      bairro: RemoverAcentos(endereco.bairro),
      cidade: RemoverAcentos(endereco.cidade),
      uf: RemoverAcentos(endereco.estado),
      Accept: 'application/json',
    };

    const options: any = {
      headers: headers,
      method: 'POST',
      redirect: 'follow',
    };
    // console.log(headers);
    try {
      const response = await axios(API_URL + '/companies', options).then(
        (response) => {
          // console.log(response);
          if (response.status === 200) {
            updateData();
            toggle();
            setLoading(false);
            setOpenSnack(true);
          } else {
            setOpenSnackError(true);
            setLoading(false);
          }
        },
      );
    } catch (error) {
      setOpenSnackError(true);
      setLoading(false);
    }
  };

  // console.log(data);

  const colorSecondaryButton =
    API_BASE === 'estrela'
      ? 'bg-blue500'
      : API_BASE === 'sbaraini'
      ? 'bg-blue'
      : API_BASE === 'localhost'
      ? 'bg-blue'
      : 'bg-blue';

  const hoverSecondaryButton =
    API_BASE === 'estrela'
      ? 'hover:bg-blue500'
      : API_BASE === 'sbaraini'
      ? 'hover:bg-blue'
      : API_BASE === 'localhost'
      ? 'hover:bg-blue'
      : 'hover:bg-blue';

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
          Empresa cadastrada com sucesso!
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
          Erro ao cadastrar a empresa!
        </Alert>
      </Snackbar>

      <div className="flex justify-center">
        <ButtonSecondary
          onClick={toggle}
          type="button"
          bgColor={colorSecondaryButton}
          hoverColor={hoverSecondaryButton}
        >
          Cadastrar Empresa
        </ButtonSecondary>{' '}
      </div>
      <LayoutModal open={open} onClose={toggle}>
        <Typography.Title
          level={2}
          className={`font-inter ${tertiaryColor} md:mt-3 mt-0`}
        >
          Cadastrar Empresa
        </Typography.Title>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
            <FormControl fullWidth>
              <InputSecondary
                placeholder="CNPJ"
                className="inputProtocolo font-inter"
                value={CNPJ}
                onChange={(value) => setCNPJ(value)}
                id="CNPJ-empresa"
                iconStart={undefined}
              />
              {CNPJ.length > 0 && !cnpj.isValid(CNPJ) ? (
                <p className="font-inter text-red text-sm">CNPJ Inválido</p>
              ) : (
                ''
              )}
            </FormControl>
            <FormControl fullWidth>
              <InputSecondary
                placeholder="Nome da Empresa"
                className="inputProtocolo font-inter"
                value={razaoSocial}
                onChange={(value) => setRazaoSocial(value)}
                id="nome-empresa"
                iconStart={undefined}
              />
            </FormControl>
          </div>

          <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
            <FormControl fullWidth>
              <InputSecondary
                iconStart={undefined}
                placeholder="CEP"
                className="inputProtocolo font-inter"
                id="cep"
                value={endereco.cep}
                maxLength={8}
                onChange={(value) => handleChange('cep', value)}
                name="cep"
              />
            </FormControl>
            <FormControl fullWidth>
              <InputSecondary
                placeholder="Rua"
                className="inputProtocolo font-inter"
                id="rua-empresa"
                value={endereco.rua}
                onChange={(value) => handleChange('rua', value)}
                iconStart={undefined}
              />
            </FormControl>
          </div>
          <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
            <FormControl fullWidth>
              <InputSecondary
                placeholder="Número"
                className="inputProtocolo font-inter"
                value={endereco.numero}
                onChange={(value) => handleChange('numero', value)}
                id="numero-empresa"
                iconStart={undefined}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputSecondary
                placeholder="Complemento"
                required={false}
                className="inputProtocolo font-inter"
                id="complemento-empresa"
                value={endereco.complemento}
                onChange={(value) => handleChange('complemento', value)}
                iconStart={undefined}
              />
            </FormControl>
          </div>
          <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
            <FormControl fullWidth>
              <InputSecondary
                placeholder="Cidade"
                className="inputProtocolo font-inter"
                value={endereco.cidade}
                onChange={(value) => handleChange('cidade', value)}
                id="cidade-empresa"
                iconStart={undefined}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputSecondary
                placeholder="Estado"
                className="inputProtocolo font-inter"
                value={endereco.estado}
                onChange={(value) => handleChange('estado', value)}
                id="estado-empresa"
                iconStart={undefined}
              />
            </FormControl>
          </div>
          <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1 mb-3">
            <FormControl fullWidth>
              <InputSecondary
                placeholder="Prazo padrão para resolução da Denúncia"
                className="inputProtocolo font-inter"
                value={prazoPadrao}
                onChange={(value) => setPrazoPadrao(value)}
                id="prazo-padrao-empresa"
                maxLength={2}
                iconStart={undefined}
              />
            </FormControl>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : (
            <ButtonSecondary
              type="submit"
              bgColor={colorSecondaryButton}
              hoverColor={hoverSecondaryButton}
            >
              Cadastrar
            </ButtonSecondary>
          )}
        </form>
      </LayoutModal>
    </>
  );
}
