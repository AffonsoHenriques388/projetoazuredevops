/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  FormControl,
  FormHelperText,
  Modal,
  Portal,
  Snackbar,
  Typography,
} from '@mui/material';
import useModal from '../../components/Modal/useModal';
import { getThemeColors } from '../../themeColors';
import InputSecondary from '../../components/Input/InputSecondary';
import { FormEvent, useState } from 'react';
import { API_BASE, API_URL } from '../../API/apiManager';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import React from 'react';
import axios from 'axios';
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

const CriarTipologia = ({ fetchData, company, user }: any) => {
  const { open, toggle } = useModal();
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const [openCriarTipologia, setOpenCriarTipologia] = useState<boolean>(false);
  const [nomeNovaTipologia, setNomeNovaTipologia] = useState<string>('');
  const [prazoNovaTipologia, setPrazoNovaTipologia] = useState<string>('');

  const handleOpenCriarTipologia = () => {
    setOpenCriarTipologia(true);
  };

  const handleCloseCriarTipologia = () => {
    setOpenCriarTipologia(false);
  };
  // console.log(prazoNovaTipologia);

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

  const handlePost = (e: FormEvent) => {
    e.preventDefault();
    const myHeaders = new Headers();

    myHeaders.append('BASE', API_BASE);
    myHeaders.append('IDCOMPANY', company.IDCOMPANY);
    myHeaders.append('RESOLUTIONTIME', prazoNovaTipologia);
    myHeaders.append('USER', user);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      ComplaintName: nomeNovaTipologia,
    });

    const requestOptions: object = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(API_URL + '/companies/tipology', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.statusCode === 200) {
          fetchData();
          setOpenSnack(true);
          setOpenCriarTipologia(false);
        }
      })
      .catch((_error) => setOpenSnackError(true));
  };

  return (
    <>
      <Snackbar
        sx={{ zIndex: 100000000 }}
        className="font-inter z-auto"
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Tipologia criada com sucesso
        </Alert>
      </Snackbar>

      <Snackbar
        sx={{ zIndex: 10000 }}
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
          Erro ao criar tipologia
        </Alert>
      </Snackbar>

      <FormControl fullWidth>
        <button
          type="button"
          className={`${primaryColor} text-white rounded shadow py-2 px-3`}
          onClick={handleOpenCriarTipologia}
        >
          Criar Tipologia
        </button>
      </FormControl>
      <Modal
        open={openCriarTipologia}
        onClose={handleCloseCriarTipologia}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handlePost}>
            <Typography className="font-inter text-lg font-semibold md:text-md text-gray200 mb-4 text-center">
              Criar Nova Tipologia
            </Typography>{' '}
            <FormControl fullWidth>
              <InputSecondary
                required={false}
                placeholder="Nome Tipologia"
                className="inputProtocolo font-inter"
                id="nome-tipologia"
                iconStart={undefined}
                value={nomeNovaTipologia}
                onChange={(value) => setNomeNovaTipologia(value)}
                name="Nome-Tipologia"
              />
              <FormHelperText>Nome Tipologia</FormHelperText>
            </FormControl>
            <FormControl fullWidth className="mt-2">
              <InputSecondary
                required={false}
                placeholder="Prazo Tipologia"
                className="inputProtocolo font-inter"
                id="prazo-tipologia"
                iconStart={undefined}
                value={prazoNovaTipologia}
                maxLength={2}
                onChange={(value) => setPrazoNovaTipologia(value)}
                name="Prazo-Tipologia"
              />
              <FormHelperText>Prazo Tipologia</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <button
                type="submit"
                className={`${primaryColor} text-white rounded shadow py-2 px-3 mt-3`}
              >
                Criar Nova Tipologia
              </button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export { CriarTipologia };
