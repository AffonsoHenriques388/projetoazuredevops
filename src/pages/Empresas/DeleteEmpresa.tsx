/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { IoIosClose } from 'react-icons/io';
import LayoutModal from '../../components/Modal/Modal';
import useModal from '../../components/Modal/useModal';
import { FormHelperText, IconButton, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Typography } from 'antd';
import Warning from '../../assets/aviso.svg';
import { API_BASE, API_URL } from '../../API/apiManager';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import { getThemeColors } from '../../themeColors';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DeleteEmpresa({ company, updateData }: any) {
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

  

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = {
      Base: API_BASE,
      CNPJCOMPANY: company.CNPJ,
      Accept: 'application/json',
    };

    const options: any = {
      method: 'DELETE',
      headers: headers,
      redirect: 'follow',
      url: `${API_URL}/companies`,
    };

    try {
      const response = await axios(options).then((response: any) => {
        // console.log(response);
        if (response.data.statusCode === 200) {
          setLoading(false);
          setOpenSnack(true);

          setTimeout(() => {
            updateData();
            toggle();
          }, 1500);
        } else {
          setLoading(false);
          setOpenSnackError(true);
        }
      });

      console.log(response);
    } catch (error) {
      setOpenSnackError(true);
    }
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
          Empresa excluída com sucesso!
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
          Erro ao excluir empresa!
        </Alert>
      </Snackbar>
      <IconButton onClick={toggle}>
        <IoIosClose className={`${tertiaryColor}`} />
      </IconButton>

      <LayoutModal open={open} onClose={toggle}>
        <Typography.Title
          level={2}
          className={`font-inter ${tertiaryColor} md:mt-3 mt-0`}
        >
          Deletar Empresa
        </Typography.Title>
        <form onSubmit={handleDelete}>
          <div className="flex justify-center mb-3">
            <img
              src={Warning}
              style={{ display: 'block', maxWidth: '150px', minWidth: '100px' }}
            />
          </div>
          <p className="font-inter text-gray200 md:text-lg text-base break-words">
            Deseja realmente deletar a empresa {'  '}
            <span className={`${tertiaryColor} font-bold`}>
              {company?.CNPJ?.replace(/\D/g, '').replace(
                /^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/,
                '$1.$2.$3/$4-$5',
              )}{' '}
              - {company?.RAZAOSOCIAL}
            </span>
            ?
          </p>
          <FormHelperText className="text-center">
            Ao deletar esta empresa todos os dados serão perdidos.
          </FormHelperText>
          {loading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : (
            <button
              className="p-3 bg-red200 font-inter text-white rounded mt-3 w-full"
              type="submit"
            >
              Deletar
            </button>
          )}
        </form>
      </LayoutModal>
    </>
  );
}
