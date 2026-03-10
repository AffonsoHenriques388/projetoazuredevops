/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useModal from '../../components/Modal/useModal';
import LayoutModal from '../../components/Modal/Modal';
import React from 'react';
import {
  Divider,
  FormHelperText,
  IconButton,
  Snackbar,
  TextareaAutosize,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { API_BASE, API_URL } from '../../API/apiManager';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import axios from 'axios';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import ButtonSecondary from '../../components/Button/ButtonSecondary';
import Loading from '../../components/Loading/Loading';
import { getThemeColors } from '../../themeColors';

interface UploadFiles {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
  fileHash: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EnviarDenuncia({ complaint, handleAtt }: any) {
  const { open, toggle } = useModal();
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const [deliberacao, setDeliberacao] = React.useState<string | boolean>('');
  const [selectedFiles, setSelectedFiles] = React.useState<File[] | any>([]);
  const [uploadFiles, setUploadFiles] = React.useState<UploadFiles[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [complaintText, setComplaintText] = React.useState('');

  const isMobile = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('sm');
  });

  // console.log(data);

  // console.log(handleAtt);

  //lida com o change do input file e faz o set na variável
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files![0];
    if (!file) return; // Se nenhum arquivo for selecionado vai sair da funcao
    const newFiles = [...selectedFiles];
    const hashName = generateUUID() + '.' + getFileExtension(file.name);
    const uploadLink = await getPreSignedURL(hashName, file.type);

    newFiles[index] = {
      file,
      hashName,
      uploadLink,
    };

    setSelectedFiles(newFiles);
    setUploadFiles([
      ...uploadFiles,
      { fileName: file.name, fileHash: hashName },
    ]);
  };

  const generateUUID = () => {
    return uuidv4();
  };

  const getFileExtension = (filename: string | string[]) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  };
  // console.log(handleAtt);
  const getPreSignedURL = async (hashName: string, fileType: string) => {
    // chamanda o endpoint https://api-canaldenuncias.pollvo.com/dev/complaints/complaint/upload/presignedurl e passando os parametros no header
    // e retorna o link de upload
    const headers: any = {
      'Content-Type': 'application/json',
      Base: API_BASE,
      CompanyName: API_BASE,
      FileName: hashName,
      FileType: fileType,
    };
    // console.log(headers);
    const response = await fetch(
      API_URL + '/complaints/complaint/upload/presignedurl',
      {
        method: 'GET',
        headers: headers,
      },
    );
    // console.log(response);
    const data = await response.json();
    // console.log(data);
    if (data.statusCode === 600) {
      setError('Tipo de arquivo não permitido. Tente novamente');
    } else {
      setError(null);
    }
    return data;
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (selectedFiles.length === 1) {
      handleComents();
      // handleSubmit();
      return;
    } else {
      selectedFiles.forEach(async (item: any) => {
        const options: any = {
          method: 'PUT',
          data: item.file,
          url: item.uploadLink,
          headers: {
            'Content-Type': item.file.type,
          },
        };

        try {
          const response = await axios(options);
          // console.log(response);
          if (response.status === 200) {
            // console.log(response.status);
            message.success('Arquivo enviado com sucesso!');
          }
        } catch (error) {
          console.log(error, 'error');
        }
      });
      handleComents();
      // handleSubmit();
    }
  };

  // console.log(uploadFiles);

  // console.log(selectedFiles);

  const addFileInput = () => {
    setSelectedFiles([...selectedFiles, null!]);
  };

  const removeLastFileInput = () => {
    const newFiles = [...selectedFiles];
    newFiles.pop();
    setSelectedFiles(newFiles);

    const newUploadFiles = [...uploadFiles];
    newUploadFiles.pop();
    setUploadFiles(newUploadFiles);
  };

  const getToken = sessionStorage.getItem('tokeRBAC');

  if (getToken !== null) {
    var token = JSON.parse(atob(getToken.split('.')[1]));
  }

  const user = token.email;

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

  // console.log(user);

  //comment type 1 = publico
  //comment type 2 = interno

  const typeComplaint: string =
    deliberacao === 'concluida-com-sucesso' ? '1' : 'não concluída';

  // console.log(typeComplaint);

  const handleComents = async () => {
    setLoading(true);

    const headers: any = {
      Base: API_BASE,
      commenttype: 2,
      protocolNumber: complaint.PROTOCOL,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const raw = JSON.stringify({
      CommentFrom: user,
      Comment: complaintText,
      uploadFiles: uploadFiles,
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
      setUploadFiles([]);
      setSelectedFiles([]);
      setComplaintText('');
      handleSubmit();
      setOpenSnack(true);
    } catch (error) {
      console.log(error);
    }
  };

  // const [dadosProps, setDadosProps] = React.useState(complaint);

  // const ACTIONS = {
  //   ATUALIZAR_DADOS: 'atualizar_dados',
  // };

  // const reducer = (state: any, action: any) => {
  //   switch (action.type) {
  //     case ACTIONS.ATUALIZAR_DADOS:
  //       return { ...state, dados: action.payload };
  //     default:
  //       return state;
  //   }
  // };

  // const [state, dispatch] = React.useReducer(reducer, {
  //   dados: complaint,
  // });

  // React.useEffect(() => {
  //   dispatch({ type: ACTIONS.ATUALIZAR_DADOS, payload: complaint });
  // }, []);

  // console.log(state.dados, 'denuncias, state.dados');

  const colorBase =
    API_BASE === 'localhost'
      ? '#009CDE'
      : API_BASE === 'sbaraini'
      ? '#009CDE'
      : API_BASE === 'estrela'
      ? '#F4A231'
      : '#009CDE';

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
          Status da denúncia alterado com sucesso!
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
          Erro ao alterar o status da denúncia!
        </Alert>
      </Snackbar>

      <LayoutModal open={open} onClose={toggle}>
        <form onSubmit={handleUpload}>
          <div className="font-inter flex flex-col w-full overflow-scroll">
            <Typography
              className={`font-inter text-gray200 text-center font-bold`}
              variant={isMobile ? 'h6' : 'h5'}
            >
              Prosseguimento da Denúncia
            </Typography>
          </div>
          <div className="flex justify-center">
            <Typography
              className={`font-inter ${tertiaryColor} text-center font-semibold`}
              variant={'h5'}
            >
              A deliberação da denúncia nº {complaint.PROTOCOL} foi concluída
              com sucesso?
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
          </div>
          <FormHelperText className="text-center">
            Caso marque sim, a denúncia será concluída e encaminhada para a fase
            de Avaliação do Comitê de Ética.
          </FormHelperText>
          {deliberacao === 'concluida-com-sucesso' ? (
            <div className="flex justify-center flex-col align-center mt-3">
              <p className="font-inter text-gray200 text-center text-sm md:text-base">
                Possui algum vídeo, documento, áudio para anexar à denúncia?
              </p>
              <div className="flex justify-center">
                <div className="flex justify-center flex-col mt-3">
                  <div className="flex justify-center align-center flex-col">
                    {selectedFiles.map(
                      (_file: any, index: React.Key | null | any) => (
                        <div className="flex justify-center">
                          <div key={index} className="mt-3 ">
                            <input
                              type="file"
                              onChange={(e) => handleFileChange(e, index)}
                              disabled={
                                selectedFiles.length > 0 && selectedFiles[index]
                              }
                              accept=".png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .avi, .wmv, .mp4, .mp3, .wav, .m4a, .opus, .ogg"
                            />

                            {selectedFiles.length > 0 && (
                              <IconButton
                                disableRipple={true}
                                type="button"
                                onClick={removeLastFileInput}
                                disabled={index !== selectedFiles.length - 1}
                              >
                                <AiOutlineMinus
                                  style={{
                                    color: colorBase,
                                  }}
                                />
                              </IconButton>
                            )}
                            <Divider className="mt-3" />
                          </div>
                        </div>
                      ),
                    )}

                    <FormHelperText className="font-bold">
                      Os tipos de arquivos aceitos são png, jpg, jpeg, pdf, doc,
                      docx, xls, xlsx, avi, wmv, mp4, mp3, wav, m4a, opus e ogg.
                    </FormHelperText>
                    <p className="text-red font-bold font-inter text-center text-sm md:mt-3 mt-1">
                      {error}
                    </p>
                    <div className="flex flex-row justify-center">
                      <IconButton
                        type="button"
                        onClick={addFileInput}
                        disableRipple={true}
                      >
                        <AiOutlinePlus
                          style={{
                            backgroundColor: colorBase,
                            color: 'white',
                            padding: 3,
                            borderRadius: '50%',
                          }}
                        />
                      </IconButton>
                    </div>
                    <FormHelperText className="text-center">
                      Adicione ou remova os campos para upload de arquivo
                    </FormHelperText>
                  </div>
                </div>
              </div>
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
                {' '}
                {loading ? (
                  <Loading />
                ) : (
                  <ButtonSecondary
                    type="submit"
                    bgColor={colorSecondaryButton}
                    hoverColor={hoverSecondaryButton}
                  >
                    Prosseguir
                  </ButtonSecondary>
                )}
              </div>
            </div>
          ) : null}
        </form>
      </LayoutModal>
    </>
  );
}
