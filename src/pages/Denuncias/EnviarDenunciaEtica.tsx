/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TextareaAutosize,
  Typography,
  Theme,
  useMediaQuery,
  FormHelperText,
  Snackbar,
} from '@mui/material';
import React from 'react';
import LayoutModal from '../../components/Modal/Modal';
import useModal from '../../components/Modal/useModal';
import { API_BASE, API_URL } from '../../API/apiManager';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Loading from '../../components/Loading/Loading';
import { getThemeColors } from '../../themeColors';
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EnviarDenunciaEtica({ complaint, handleAtt }: any) {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const [deliberacao, setDeliberacao] = React.useState<string | boolean>('');
  const [complaintText, setComplaintText] = React.useState('');
  const [complaintTextNo, setComplaintTextNo] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { open, toggle } = useModal();
  const isMobile = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('sm');
  });

  const typeComplaint: string =
    deliberacao === 'concluida-com-sucesso' ? '1' : '0';

  const getToken = sessionStorage.getItem('tokeRBAC');

  if (getToken !== null) {
    var token = JSON.parse(atob(getToken.split('.')[1]));
  }

  const user = token.email;

  const handleComplaints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deliberacao === 'concluida-com-sucesso') {
      setLoading(true);
      const headers: any = {
        Base: API_BASE,
        commenttype: 2,
        protocolNumber: complaint.PROTOCOL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      console.log(headers);
      const raw = JSON.stringify({
        CommentFrom: user,
        Comment: complaintText,
        uploadFiles: '',
      });
      // console.log(raw);
      let requestOptions: any = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow',
      };
      // console.log(requestOptions);
      try {
        const response = await fetch(
          API_URL + '/complaints/complaint/comments',
          requestOptions,
        );
        // console.log(response);
        // console.log(requestOptions);
        const data = await response.json();
        // console.log(data);
        setLoading(false);
        setComplaintText('');
        handleSubmit();
        // handleAtt();
      } catch (error) {
        setOpenSnackError(true);
      }
    } else {
      setLoading(true);
      // console.log('chegou aqui! 2');
      const headers: any = {
        Base: API_BASE,
        commenttype: 2,
        protocolNumber: complaint.PROTOCOL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const raw = JSON.stringify({
        CommentFrom: user,
        Comment: complaintTextNo,
        uploadFiles: '',
      });
      console.log(raw);
      let requestOptions: any = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow',
      };
      // console.log(headers);
      try {
        const response = await fetch(
          API_URL + '/complaints/complaint/comments',
          requestOptions,
        );
        // console.log(response);
        // console.log(requestOptions);
        const data = await response.json();
        // console.log(data);
        setLoading(false);
        setComplaintTextNo('');
        handleSubmit();
        setOpenSnack(true);
        // handleAtt();
      } catch (error) {
        setOpenSnackError(true);
      }
    }
  };
  // console.log(complaint);
  const handleSubmit = async () => {
    var myHeaders = new Headers();
    myHeaders.append('base', API_BASE);
    myHeaders.append('sentstatus', typeComplaint);
    myHeaders.append('protocolnumber', complaint.PROTOCOL);
    myHeaders.append('Accept', 'application/json');

    var requestOptions: any = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
    };
    fetch(API_URL + '/admin/complaints/status', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.statusCode === 200) {
          setLoading(false);
          setOpenSnack(true);
          handleAtt();
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setOpenSnackError(true);
      });
  };

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

  return (
    <>
      <button
        className="bg-green md:px-2 md:py-3 text-white font-inter rounded-md md:text-sm text-sx px-1 py-2"
        onClick={toggle}
      >
        Enviar Denúncia
      </button>
      <Snackbar
        className="font-inter"
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Denúncia enviada para a fase de Finalização com sucesso!
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
          Erro ao enviar a denúncia para a fase de Finalização!
        </Alert>
      </Snackbar>
      <LayoutModal open={open} onClose={toggle}>
        <form onSubmit={handleComplaints}>
          <div className="font-inter flex flex-col w-full overflow-scroll">
            <Typography
              className="font-inter text-gray200 text-center font-bold"
              variant={isMobile ? 'h6' : 'h5'}
            >
              Prosseguir com a denúncia nº {complaint.PROTOCOL}?
            </Typography>
          </div>
          <div className="flex justify-center">
            <Typography
              className={`font-inter ${tertiaryColor} text-center font-semibold`}
              variant={'h5'}
            >
              A deliberação do Comitê de Ética foi concluída com sucesso?
            </Typography>
          </div>
          <div className="flex justify-center flex-row gap-2 mt-2">
            <label
              htmlFor="deliberacao"
              className="font-inter text-gray200 text-center text-base md:text-md"
            >
              <input
                type="radio"
                name="sim-deliberacao"
                value="concluida-com-sucesso"
                checked={deliberacao === 'concluida-com-sucesso'}
                onChange={(e) => setDeliberacao(e.target.value)}
              />
              {'     '}
              Sim, foi concluída com sucesso!{' '}
            </label>

            <label
              htmlFor="deliberacao"
              className="font-inter text-gray200 text-center text-base md:text-md"
            >
              <input
                type="radio"
                name="nao-deliberacao"
                value="preciso-de-mais-infos"
                checked={deliberacao === 'preciso-de-mais-infos'}
                onChange={(e) => setDeliberacao(e.target.value)}
              />
              {'     '}
              Não, preciso de mais informações{' '}
            </label>
          </div>
          <FormHelperText className="text-center">
            Caso marque sim a denúncia será concluída e encaminhada para a fase
            de Finalização.
          </FormHelperText>
          {deliberacao === 'concluida-com-sucesso' ? (
            <div className="flex justify-center flex-col align-center mt-3">
              <p className="font-inter text-gray200 text-center text-sm md:text-base">
                Deseja fazer algum comentário na denúncia?
              </p>
              <div className="w-full mt-3 flex justify-center align-center">
                <TextareaAutosize
                  className="w-full text-sm font-normal font-sans leading-5 p-3 rounded-xl rounded-br-none shadow-md shadow-slate-100 focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 focus:border-blue-500 bg-white text-slate-900 focus-visible:outline-0"
                  placeholder="Comentário interno"
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  name="textoDenuncia"
                />
              </div>
              <div className="flex justify-center mt-3">
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    className={`w-full p-3 ${primaryColor} text-white font-inter rounded mt-3`}
                  >
                    Enviar Comentário
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {deliberacao === 'preciso-de-mais-infos' ? (
            <div className="flex justify-center flex-col align-center mt-3">
              <p className="font-inter text-gray200 text-center text-sm md:text-base">
                Deseja fazer algum comentário na denúncia?
              </p>
              <div className="w-full mt-3 flex justify-center align-center">
                <TextareaAutosize
                  className="w-full text-sm font-normal font-sans leading-5 p-3 rounded-xl rounded-br-none shadow-md shadow-slate-100 focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 focus:border-blue-500 bg-white text-slate-900 focus-visible:outline-0"
                  placeholder="Comentário interno"
                  value={complaintTextNo}
                  onChange={(e) => setComplaintTextNo(e.target.value)}
                  name="textoDenuncia"
                />
              </div>
              {loading ? (
                <div className="flex justify-center">
                  <Loading />
                </div>
              ) : (
                <button
                  className={`w-full p-3 ${primaryColor} text-white font-inter rounded mt-3`}
                  type="submit"
                >
                  Enviar Comentário
                </button>
              )}
            </div>
          ) : null}
        </form>
      </LayoutModal>
    </>
  );
}
