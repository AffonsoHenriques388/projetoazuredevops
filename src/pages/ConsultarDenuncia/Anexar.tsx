/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Typography from '@mui/material/Typography';
import useModal from '../../components/Modal/useModal';
import LayoutModal from '../../components/Modal/Modal';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import ButtonSecondary from '../../components/Button/ButtonSecondary';
import { IconButton, Snackbar } from '@mui/material';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { FormHelperText, Divider } from '@mui/material';
import { useAuth } from '../../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import { FormEvent } from 'react';
import axios from 'axios';
import { message } from 'antd';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { API_BASE, API_URL } from '../../API/apiManager';
import Loading from '../../components/Loading/Loading';
import { getThemeColors } from '../../themeColors';
import { useDataContext } from '../../context/DataContext';
import {
  IComentarioConsultaContext,
  useComentarioConsultaContext,
} from '../../context/ComentarioConsultaContext';

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};
const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 320px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px 12px 0 12px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === 'dark' ? grey[900] : grey[50]
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === 'dark' ? blue[500] : blue[200]
    };
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

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

export default function Anexar() {
  const { open, toggle } = useModal();
  const { primaryColor, secondaryColor, tertiaryColor, fourthColor } =
    getThemeColors();
  const [comentarios, setComentarios] = React.useState('');
  const [files, setFiles] = React.useState<File[] | any>([1]);
  const { protocol } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [newMessage, setNewMessage] = React.useState('');
  const { setData } =
    useComentarioConsultaContext() as IComentarioConsultaContext;
  const [uploadFiles, setUploadFiles] = React.useState<UploadFiles[]>([]);

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

  const handleComentários = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentarios(event.target.value);
  };

  const getFileExtension = (filename: string | string[]) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  };

  const generateUUID = () => {
    return uuidv4();
  };

  const getPreSignedURL = async (hashName: string, fileType: string) => {
    // chamanda o endpoint https://api-canaldenuncias.pollvo.com/dev/complaints/complaint/upload/presignedurl e passando os parametros no header
    // e retorna o link de upload
    const headers = {
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

    if (data.statusCode === 600) {
      setError('Tipo de arquivo não permitido. Tente novamente');
    } else {
      setError(null);
    }
    return data;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newFiles = [...files];
    const file = e.target.files![0];

    const hashName = generateUUID() + '.' + getFileExtension(file.name);
    const uploadLink = await getPreSignedURL(hashName, file.type);

    newFiles[index] = {
      file,
      hashName,
      uploadLink,
    };

    setFiles(newFiles);
    setUploadFiles([
      ...uploadFiles,
      { fileName: file.name, fileHash: hashName },
    ]);
  };

  // const handleUpload = (e: FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   if (files.length > 1) {
  //     handleSubmit();
  //     // console.log('Não há arquivos para enviar');
  //   } else {
  //     files.forEach(async (item: any) => {
  //       const options: any = {
  //         method: 'PUT',
  //         data: item.file,
  //         url: item.uploadLink,
  //         headers: {
  //           'Content-Type': item.file.type,
  //         },
  //       };

  //       try {
  //         const response = await axios(options);
  //         // console.log(response);
  //         if (response.status === 200) {
  //           // console.log(response.status);
  //           setOpenSnack(true);
  //         }
  //       } catch (error) {
  //         setOpenSnackError(true);
  //         console.log(error, 'error');
  //       }
  //     });
  //     // console.log('bateu aquii');
  //     handleSubmit();
  //   }
  // };

  const handleUpload = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (files.length > 1) {
      handleSubmit();
    } else {
      files.forEach(async (item: any) => {
        if (item && item.file && item.file.type) {
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
            if (response.status === 200) {
              setOpenSnack(true);
              // console.log(response);
            }
          } catch (error) {
            setOpenSnackError(true);
            console.log(error, 'error');
          }
        } else {
          console.error('File or file type is undefined:', item);
        }
      });

      handleSubmit();
    }
  };

  // console.log(protocol);const

  const handleSubmit = async () => {
    setLoading(true);
    // protocolNumber.forEach(async (item: any) => {
    const headers: any = {
      Base: API_BASE,
      commenttype: 1,
      protocolNumber: protocol.PROTOCOL,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const raw = JSON.stringify({
      CommentFrom: protocol.COMPLAIERNAME,
      Comment: comentarios,
      uploadFiles: uploadFiles,
    });

    // console.log(raw);

    // console.log(headers);
    let requestOptions: any = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        API_URL + '/complaints/complaint/comments',
        requestOptions,
      );
      // console.log(response.body);
      const dataResult = await response.json();
      // console.log(data);

      if (response.status && dataResult.statusCode === 200) {
        setOpenSnack(true);
        // console.log('foi');
        // setData((prevData) => [...prevData, raw]);
        toggle();
        getData();
        setLoading(false);
      } else {
        setOpenSnackError(true);
        // console.log('error');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setOpenSnackError(true);
    }
    // });
  };

  const getData = () => {
    const options = {
      gettype: 1,
      Base: API_BASE,
      ProtocolNumber: protocol.PROTOCOL,
      Accept: 'application/json',
    };
    axios
      .get(API_URL + '/complaints/complaint/comments', { headers: options })
      .then((response) => {
        // console.log(response.data.body);
        setData(response.data.body);
      });
  };

  const bgColor =
    API_BASE === 'estrela'
      ? 'bg-blue500'
      : API_BASE === 'sbaraini'
      ? 'bg-blue'
      : API_BASE === 'localhost'
      ? 'bg-blue'
      : 'bg-blue';

  const hoverColor =
    API_BASE === 'estrela'
      ? 'hover:bg-blue500'
      : API_BASE === 'sbaraini'
      ? 'hover:bg-blue'
      : API_BASE === 'localhost'
      ? 'hover:bg-blue'
      : 'hover:bg-blue';

  return (
    <form
      className="flex justify-center flex-col text-center"
      onSubmit={handleUpload}
    >
      <Snackbar
        className="font-inter"
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Comentário enviado com sucesso!
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
          Erro ao anexar comentário!
        </Alert>
      </Snackbar>
      <Typography className="font-inter mb-2 text-white">
        Precisa incluir novos comentários e arquivos?
      </Typography>
      <ButtonSecondary
        onClick={toggle}
        type="button"
        bgColor={bgColor}
        hoverColor={hoverColor}
      >
        Adicionar Comentário ou Documento
      </ButtonSecondary>
      <LayoutModal onClose={toggle} open={open}>
        <div className="flex justify-center flex-col text-center">
          {' '}
          <Typography className="font-inter mb-2">
            Incluir novo comentário
          </Typography>
          <StyledTextarea
            aria-label="minimum height"
            minRows={3}
            className="font-inter text-gray200 text-sm md:text-base w-full rounded-xl rounded-br-none shadow-md shadow-slate-100 focus:shadow-outline-purple900 focus:shadow-lg border border-solid border-slate-300 hover:border-purple900 focus:border-purple900 bg-white focus-visible:outline-0"
            placeholder="Novo comentário"
            value={comentarios}
            onChange={handleComentários}
          />
        </div>
        {API_BASE.toLowerCase() === 'usj' ? null : (
          <div className="flex justify-center text-center flex-col mt-3">
            <Typography className="font-inter mb-3">
              Incluir novo anexo
            </Typography>
            <div className="flex justify-center flex-col">
              {files.map((_file: any, index: number) => (
                <div key={index} className="mt-3">
                  {/* Exibe o nome do arquivo */}

                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                  <Divider className="mt-3" />
                </div>
              ))}

              <FormHelperText className="font-bold text-center">
                Os tipos de arquivos aceitos são png, jpg, jpeg, pdf, doc, docx,
                xls, xlsx, avi, wmv, mp4, mp3, wav, m4a, opus e ogg.
              </FormHelperText>
              <p className="text-red font-bold font-inter text-center text-sm md:mt-3 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <div className="flex justify-center mt-3 flex-col">
            <div
              className="font-inter text-green md:text-base text-sm font-bold mb-3
            "
            >
              {newMessage}
            </div>
            {loading ? (
              <Loading />
            ) : (
              <button
                type="submit"
                onClick={handleUpload}
                className={`py-2 px-4 font-inter rounded-md text-sm md:text-lg radius text-white hover:${primaryColor} ${primaryColor}`}
              >
                Enviar
              </button>
            )}
          </div>
        </div>
      </LayoutModal>
    </form>
  );
}
