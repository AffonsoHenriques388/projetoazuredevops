/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography } from 'antd';
import Default from '../../components/Default/Default';
import React from 'react';
import ButtonSecondary from '../../components/Button/ButtonSecondary';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {
  Divider,
  FormHelperText,
  Snackbar,
  TextareaAutosize,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { API_BASE, API_URL } from '../../API/apiManager';
import { message } from 'antd';
import axios from 'axios';
import { MdExpandMore } from 'react-icons/md';
import LayoutModal from '../../components/Modal/Modal';
import useModal from '../../components/Modal/useModal';
import { useAuth } from '../../context/UserContext';
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

export default function EditCustomizacoes() {
  const { primaryColor, secondaryColor, tertiaryColor, sixthColor } =
    getThemeColors();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const { toggle, open } = useModal();
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const iconRef = React.useRef<HTMLInputElement>(null!);
  const [preview, setPreview] = React.useState('');
  const [logoNovo, setLogoNovo] = React.useState('');
  const [texto, setTexto] = React.useState('');
  const [disclaimer, setDisclaimer] = React.useState('');
  const [files, setFiles] = React.useState<File[] | any>([]);
  const [errorUpload, setErrorUpload] = React.useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = React.useState<UploadFiles[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { logo, setLogo } = useAuth();

  console.log(texto);
  console.log(disclaimer);
  const getToken = sessionStorage.getItem('tokeRBAC');

  // console.log(getToken);
  if (getToken !== null) {
    var token = JSON.parse(atob(getToken.split('.')[1]));
  }
  const isAdmin = token.user_access;

  const onBtnClick = () => {
    iconRef?.current.click();
  };
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    console.log(URL.createObjectURL(file));
    setPreview(URL.createObjectURL(file));
    console.log(file);
    validateFile(file);
  };

  const getFileExtension = (filename: string | string[]) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  };

  const generateUUID = () => {
    return uuidv4();
  };

  const handleFileInput = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files ? event.target.files[0] : null;

      if (!file) {
        console.error('Nenhum arquivo foi selecionado');
        return;
      }

      setPreview(URL.createObjectURL(file));
      console.log(file);

      // Validate the file
      validateFile(file);

      // Generate a unique hash name for the file
      const hashName = generateUUID() + '.' + getFileExtension(file.name);

      // Obtain a pre-signed URL for uploading the file
      const uploadLink = await getPreSignedURL(hashName, file.type);

      // Update the file information
      const newFiles = [
        {
          file,
          hashName,
          uploadLink,
        },
      ];

      // Update the state
      setFiles(newFiles);
      setUploadFiles([{ fileName: file.name, fileHash: hashName }]);
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle or display the error as needed
    }
  };

  // console.log(files[0]?.hashName);
  // console.log(files[0]?.uploadLink);
  console.log(files);
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
      API_URL + '/admin/customizations/presignedurl',
      {
        method: 'GET',
        headers: headers,
      },
    );
    // console.log(response);
    const data = await response.json();
    console.log(data);
    if (data.statusCode === 600) {
      setErrorUpload('Tipo de arquivo não permitido. Tente novamente');
    } else {
      setErrorUpload(null);
    }
    return data;
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

  const handleSubmit = async () => {
    var myHeaders = new Headers();
    myHeaders.append('logoname', files[0].file.name);
    myHeaders.append('base', API_BASE);
    myHeaders.append('user', token.username);
    myHeaders.append('logohash', files[0].hashName);
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      Disclaimer: disclaimer === '' ? texto : disclaimer,
    });

    var requestOptions: any = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(API_URL + '/admin/customizations', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.statusCode === 200) {
          setLoading(false);
          setOpenSnack(true);
          GetFiles();
        } else {
          setOpenSnackError(true);
          setLoading(false);
        }
      })
      .catch(() => {
        setOpenSnackError(true);
        setLoading(false);
      });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const options: any = {
      method: 'PUT',
      data: files[0]?.file,
      url: files[0]?.uploadLink,
      headers: {
        'Content-Type': files[0]?.file.type,
      },
    };
    console.log(options);
    try {
      const response = await axios(options);
      console.log(response);
      if (response.status === 200) {
        console.log(response);
        handleSubmit();
      }
    } catch (error) {
      message.error(
        'Erro ao adicionar novo comentário e arquivos na denúncia.',
      );
      // console.log(error, 'error');
    }
  };

  const validateFile = (file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Selecione uma imagem');
      } else if (file.size > 1000000) {
        setError('O arquivo é muito grande');
      } else {
        setSelectedFile(file);
        setError('');
      }
    }
  };

  React.useEffect(() => {
    const options = {
      Base: API_BASE,
      Accept: 'application/json',
    };
    axios
      .get(API_URL + '/admin/customizations', { headers: options })
      .then((response) => {
        // console.log(response.data.body[0]);
        setTexto(response.data.body[0].DISCLAIMER);
        setLogoNovo(response.data.body[0].LOGO_LINK);
      });
  }, []);
  console.log(isAdmin);
  function GetFiles() {
    const options = {
      Base: API_BASE,
      Accept: 'application/json',
    };
    axios
      .get(API_URL + '/admin/customizations', { headers: options })
      .then((response) => {
        // console.log(response.data.body[0]);
        setTexto(response.data.body[0].DISCLAIMER);
        setLogoNovo(response.data.body[0].LOGO_LINK);
      });
  }

  return (
    <>
      <ButtonSecondary onClick={toggle}>Editar Customizações</ButtonSecondary>

      <Snackbar
        className="font-inter"
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Customizações realizadas com sucesso!
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
          Erro ao customizar logo e disclaimer!
        </Alert>
      </Snackbar>
      <LayoutModal open={open} onClose={toggle}>
        <div>
          <Typography.Title
            level={2}
            className={`font-inter ${tertiaryColor} md:mt-3 mt-0 text-center`}
          >
            Editar Customizações
          </Typography.Title>
        </div>
        <div className="flex justify-center flex-col">
          <p className={`font-inter ${tertiaryColor} font-bold text-lg`}>
            Logo atual da Aplicação:
          </p>
          <div className="">
            <img src={logoNovo} alt="logo" width={244} height={344} />
          </div>
          <Accordion className="p-3">
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              expandIcon={<MdExpandMore size={23} />}
            >
              <p className={`font-inter ${tertiaryColor} font-bold text-lg`}>
                {' '}
                Texto de Disclaimer atual da Aplicação:
              </p>
            </AccordionSummary>

            <p className="font-inter text-gray200 font-semi text-base">
              {texto}
            </p>
          </Accordion>
        </div>

        {isAdmin === 'ADMIN' ? (
          <div
            className="upload_zone flex justify-center flex-col items-center mt-3"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <form
              onSubmit={handleUpload}
              className="flex space-between flex-col w-full gap-5"
            >
              <p
                className={`font-inter ${tertiaryColor} font-bold md:text-base text-sm important`}
              >
                Altere o logo da sua aplicação. Basta fazer o upload da imagem
                abaixo.
              </p>
              <div
                className={`flex justify-center flex-col border-2 p-16 border-blue border-dashed rounded-md`}
              >
                <input
                  ref={iconRef}
                  className="file-input"
                  type="file"
                  onChange={handleFileInput}
                  name="file"
                  hidden
                />
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    fill="#009CDE"
                    className="bi bi-upload cursor-pointer"
                    viewBox="0 0 16 16"
                    onClick={onBtnClick}
                  >
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                  </svg>
                </div>

                <p className="font-inter text-gray200 md:text-lg text-md mt-4 text-center">
                  Selecione ou arraste um arquivo para upload
                </p>
                <FormHelperText className="text-center">
                  Recomendamos que seja um logo sem fundo. Somente formatos
                  jpeg, png, jpg, svg e giff serão aceitos.
                </FormHelperText>
              </div>
              <p className="mt-2 text-red font-inter font-semibold">{error}</p>
              <p className="font-inter text-blue font-bold md:text-base text-sm">
                O conteúdo desta area é designado para o texto que aparece ao
                iniciar uma nova denúncia.{' '}
              </p>
              <div className="flex justify-center align-center">
                <TextareaAutosize
                  className=" w-full text-sm font-normal font-sans leading-5 p-3 rounded-xl rounded-br-none shadow-md shadow-slate-100 focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 focus:border-blue-500 bg-white text-slate-900 focus-visible:outline-0"
                  placeholder="Disclaimer início da aplicação"
                  value={disclaimer}
                  onChange={(e) => setDisclaimer(e.target.value)}
                  name="textoDenuncia"
                />
              </div>
              <section className="flex justify-center">
                <div className="col-md-4 mt-4">
                  {preview ? (
                    <img src={preview} width={244} height={344} />
                  ) : (
                    ''
                  )}
                </div>
              </section>
              <div className="mt-4">
                {' '}
                <ButtonSecondary type="submit">Atualizar</ButtonSecondary>
              </div>
            </form>
          </div>
        ) : null}
      </LayoutModal>
    </>
  );
}
