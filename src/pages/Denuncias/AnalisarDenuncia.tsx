/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, FormEvent } from 'react';
import useModal from '../../components/Modal/useModal';
import LayoutModal from '../../components/Modal/Modal';
import { v4 as uuidv4 } from 'uuid';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import {
  Typography,
  IconButton,
  Chip,
  Divider,
  useMediaQuery,
  Theme,
  FormHelperText,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Button,
  Snackbar,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import { API_BASE, API_URL } from '../../API/apiManager';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import AccordionPublicComents from './AccordionPublicComents';
import { MdExpandMore } from 'react-icons/md';
import { message } from 'antd';
import AccordionPrivateComents from './AccordionPrivateComments';
import { getThemeColors } from '../../themeColors';

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

interface GetDataProtocol {
  ATTACHMENT: any;
  COMPLAIERNAME?: string | null;
  COMPLAINEREMAIL?: string | null;
  COMPLAINERPHONENUMBER?: string | null;
  COMPLAINTTEXT?: string | null;
  COMPLAINTTYPE?: string | null;
  CREATEDON?: string | null;
  FACTDATE?: string | null;
  HASOMISSION?: number | null;
  INVOLVEDS?: any;
  LOCATION?: string | null;
  PROTOCOL: string;
  STATUS?: number | null;
  STILLHAPPENING?: boolean | null;
  SUSPECTBUSINESSROLE?: string | null;
  SUSPECTDEPARTMENT?: string | null;
  SUSPECTNAME?: string | null;
  ATTACHMENTS?: {
    map(
      arg0: (item: any) => import('react/jsx-runtime').JSX.Element,
    ): React.ReactNode;
    length: number;
    ATTACHMENT?: string | null;
    LINK?: string | null;
  };
  PREVIOUSKNOWLAGE?: any;
}

interface GetComentsPrivateAndPublic {
  ATTACHMENT?: {
    ATTACHMENT?: string | null;
    LINK?: string | null;
  };
  COMMENT?: string | null;
  CREATEDON?: string | null;
  CREATEDBY?: string | null;
  IDCOMMENT?: number | null;
}

interface PublicComents {
  LINK: string | undefined | any;
  ATTACHMENT?: string | any;
  COMMENT?: string;
  CREATEDON?: string;
  IDCOMENT?: number;
  CREATEDBY?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AnalisarDenuncia({ complaint }: any) {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();

  const [commentComplaint, setCommentComplaint] = React.useState('');
  const [commentSystem, setcommentSystem] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<PublicComents[]>([]);
  const { open, toggle } = useModal();
  const [complaintDetails, setComplaintDetails] = React.useState<
    GetDataProtocol[]
  >([]);
  const [selectFilesPrivate, setSelectFilesPrivate] = React.useState<
    File[] | any
  >([]);
  const [uploadFilesPrivate, setUploadFilesPrivate] = React.useState<any>([]);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedFiles, setSelectedFiles] = React.useState<File[] | any>([]);
  const [uploadFiles, setUploadFiles] = React.useState<any>([]);

  const isMobile = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('sm');
  });

  const handleFileChangePrivate = async (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files![0];
    if (!file) return;
    const newFiles = [...selectFilesPrivate];

    const hashName =
      generateUUIDPrivate() + '.' + getFileExtensionPrivate(file.name);
    const uploadLink = await getPreSignedURLPrivate(hashName, file.type);

    newFiles[index] = {
      file,
      hashName,
      uploadLink,
    };

    setSelectFilesPrivate(newFiles);
    setUploadFilesPrivate([
      ...uploadFilesPrivate,
      { fileName: file.name, fileHash: hashName },
    ]);
  };
  // console.log(uploadFilesPrivate);
  const generateUUIDPrivate = () => {
    return uuidv4();
  };

  const getFileExtensionPrivate = (filename: string | string[]) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  };

  const getPreSignedURLPrivate = async (hashName: string, fileType: string) => {
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
    // console.log(data);
    if (data.statusCode === 600) {
      setError('Tipo de arquivo não permitido. Tente novamente');
    } else {
      setError(null);
    }
    return data;
  };

  const addFileInputPrivate = () => {
    setSelectFilesPrivate([...selectFilesPrivate, null!]);
  };
  const removeLastFileInputPrivate = () => {
    const newFiles = [...selectFilesPrivate];
    newFiles.pop();
    setSelectFilesPrivate(newFiles);

    const newFilesUploadPrivate = [...uploadFilesPrivate];
    newFilesUploadPrivate.pop();
    setUploadFilesPrivate(newFilesUploadPrivate);
  };

  // console.log(uploadFilesPrivate, 'uploadFilesPrivate');
  // console.log(selectFilesPrivate, 'selected files private');

  const handleUploadPrivate = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (selectFilesPrivate.length === 0) {
      handleSubmitPrivado();
    } else {
      selectFilesPrivate.forEach(async (item: any) => {
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
      handleSubmitPrivado();
    }
  };

  const handleCommentsComplaint = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCommentComplaint(event.target.value);
  };

  const handleComentsSystem = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setcommentSystem(event.target.value);
  };
  React.useEffect(() => {
    setLoading(true);
    const options = {
      Base: API_BASE,
      ProtocolNumber: complaint.PROTOCOL,
      Accept: 'application/json',
    };
    axios
      .get(API_URL + '/admin/complaints/details', { headers: options })
      .then((response: any) => {
        setComplaintDetails(response.data.body);
        // console.log(response.data.body);
        setLoading(false);
      });
  }, [complaint.PROTOCOL]);

  React.useEffect(() => {
    setLoading(true);
    const options = {
      gettype: 2,
      Base: API_BASE,
      ProtocolNumber: complaint.PROTOCOL,
      Accept: 'application/json',
    };

    axios
      .get(API_URL + '/complaints/complaint/comments', { headers: options })
      .then((response) => {
        setLoading(false);
        setData(response.data.body);
      });
  }, [complaint.PROTOCOL]);

  //lida com o change do input file e faz o set na variável
  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
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
  // console.log(uploadFiles);
  const generateUUID = () => {
    return uuidv4();
  };

  const getFileExtension = (filename: string | string[]) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
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
    // console.log(data);
    if (data.statusCode === 600) {
      setError('Tipo de arquivo não permitido. Tente novamente');
    } else {
      setError(null);
    }
    return data;
  };

  const addFileInput = () => {
    setSelectedFiles([...selectedFiles, null!]);
  };

  const removeLastFileInput = () => {
    const newFiles = [...selectedFiles];
    const newFilesUpload = [...uploadFiles];

    newFiles.pop();
    newFilesUpload.pop();

    setSelectedFiles(newFiles);
    setUploadFiles(newFilesUpload);
  };
  // console.log(selectedFiles);
  const handleUpload = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (selectedFiles.length === 0) {
      handleSubmit();
      // console.log('bateu aqui no if');
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
        // console.log('bateu aqui no else');
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
      handleSubmit();
    }
  };

  const getToken = sessionStorage.getItem('tokeRBAC');

  if (getToken !== null) {
    var token = JSON.parse(atob(getToken.split('.')[1]));
  }

  const user = token.email;

  // console.log(token);
  // console.log(complaint);
  const handleSubmit = async () => {
    setLoading(true);

    const headers: any = {
      Base: API_BASE,
      commenttype: 1,
      protocolNumber: complaint.PROTOCOL,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const raw = JSON.stringify({
      CommentFrom: user,
      Comment: commentComplaint,
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
      setCommentComplaint('');

      // handleAtt();
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(user);
  const handleSubmitPrivado = async () => {
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
      Comment: commentSystem,
      uploadFiles: uploadFilesPrivate,
    });
    console.log(raw);
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
      // console.log(response);
      // console.log(requestOptions);
      const data = await response.json();
      // console.log(data);
      setLoading(false);
      setUploadFilesPrivate([]);
      setSelectFilesPrivate([]);
      setcommentSystem('');
    } catch (error) {
      console.log(error);
    }
  };

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

  // console.log(user, 'user');

  return (
    <>
      <button
        className={`${primaryColor} md:px-2 md:py-3 text-white font-inter rounded-md md:text-sm text-sx px-1 py-2`}
        onClick={toggle}
        type="button"
      >
        Analisar Denúncia
      </button>
      <LayoutModal open={open} onClose={toggle}>
        <div className="font-inter flex flex-col w-full overflow-scroll">
          <Typography
            className="font-inter text-gray200 text-center font-bold"
            variant={isMobile ? 'h6' : 'h5'}
          >
            Analisar Denúncia
          </Typography>
          <div className="mt-3 mb-3">
            <Typography
              className="font-inter text-gray200 text-center"
              variant={isMobile ? 'h6' : 'h5'}
            >
              Identificação
            </Typography>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : (
            complaintDetails.map((complaint) => {
              // console.log(complaint);
              return (
                <div>
                  <div className="flex justify-center">
                    {/* aqui começa a identificação da denuncia */}
                    <div>
                      <div className="flex justify-between gap-5 mt-3 mb-3">
                        <Typography className="font-inter text-gray200 text-sm md:text-base">
                          Protocolo:{' '}
                          <span
                            className={`${tertiaryColor} font-semibold text-sm md:text-base`}
                          >
                            {complaint.PROTOCOL}
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base">
                          Status:{'  '}
                          <span className="text-green">
                            <Chip
                              label={
                                complaint.STATUS === 0
                                  ? 'Em análise'
                                  : complaint.STATUS === 1
                                  ? 'Avaliação do Comitê'
                                  : complaint.STATUS === 2
                                  ? 'Finalização'
                                  : 'Encerrada'
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
                              size="small"
                            />
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base">
                          Data do Registro:{' '}
                          <span className="font-semibold text-sm md:text-base">
                            {complaint.CREATEDON}
                          </span>
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <Divider />
                  {/* aqui termina a identificação da denuncia e começa os dados do denunciante */}
                  <div className="mt-3">
                    <Typography
                      className="font-inter text-gray200 text-center"
                      variant={isMobile ? 'h6' : 'h5'}
                    >
                      Dados Denunciante
                    </Typography>
                    <div className="flex justify-between gap-5 mt-3 mb-3">
                      <Typography className="font-inter text-gray200 text-sm md:text-base">
                        Nome:{' '}
                        <span className="text-gray200 font-semibold text-sm md:text-base break-all">
                          {complaint.COMPLAIERNAME === null
                            ? 'Não informado'
                            : complaint.COMPLAIERNAME}
                        </span>
                      </Typography>
                      <Typography className="font-inter text-gray200 text-sm md:text-base">
                        E-mail:{' '}
                        <span className="text-gray200 font-semibold text-sm md:text-base break-all">
                          {complaint.COMPLAINEREMAIL === null
                            ? 'Não informado'
                            : complaint.COMPLAINEREMAIL}
                        </span>
                      </Typography>
                      <Typography className="font-inter text-gray200 text-sm md:text-base">
                        Telefone:{' '}
                        <span className="text-gray200 font-semibold text-sm md:text-base break-all">
                          {complaint.COMPLAINERPHONENUMBER === null
                            ? 'Não informado'
                            : complaint.COMPLAINERPHONENUMBER}
                        </span>
                      </Typography>
                    </div>
                  </div>
                  <Divider />
                  {/* aqui termina os dados do denunciante e começa os dados da ocorrência */}
                  <div className="mt-3">
                    <Typography
                      className="font-inter text-gray200 text-center"
                      variant={isMobile ? 'h6' : 'h5'}
                    >
                      Dados da Ocorrência
                    </Typography>
                    {/* className="grid grid-cols-1 md:grid-cols-3 mt-3" */}
                    <div className="flex justify-center md:flex-row flex-col  text-left">
                      <div className="md:mr-32 mr-0">
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Nome Denunciado:{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {complaint.SUSPECTNAME === null
                              ? 'Não informado'
                              : complaint.SUSPECTNAME}
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Cargo Denunciado:{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {complaint.SUSPECTBUSINESSROLE === null
                              ? 'Não informado'
                              : complaint.SUSPECTBUSINESSROLE}
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Departamento Denunciado:{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {complaint.SUSPECTDEPARTMENT === null
                              ? 'Não informado'
                              : complaint.SUSPECTDEPARTMENT}
                          </span>
                        </Typography>
                      </div>
                      <Divider
                        orientation="vertical"
                        flexItem
                        className="ml-3"
                      />
                      {/* aqui começa o tipo de ocorrencia e afins
                       */}
                      <div className="md:ml-3 ml-0 mb-3">
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Tipo da Ocorrência:{' '}
                          <span className="text-gray200 font-semibold break-all text-sm md:text-base mb-1">
                            {complaint.COMPLAINTTYPE}
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Local da Ocorrência:{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {complaint.LOCATION === null
                              ? 'Não informado'
                              : complaint.LOCATION}
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Data do ocorrido:{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {complaint.FACTDATE === null
                              ? 'Não informado'
                              : complaint.FACTDATE}
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Fato continua ocorrendo?{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {complaint.STILLHAPPENING ? 'Sim' : 'Não'}
                          </span>
                        </Typography>
                        {API_BASE.toLowerCase() === 'usj' ? null : (
                          <>
                            {' '}
                            <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                              Liderança Envolvida/Tinha Conhecimento:{' '}
                              <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                                {complaint.HASOMISSION === 1 ? 'Sim' : 'Não'}
                              </span>
                            </Typography>
                            <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                              Nome do(s) Gestor(res):{' '}
                              <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                                {complaint.PREVIOUSKNOWLAGE &&
                                complaint.PREVIOUSKNOWLAGE.length > 0
                                  ? complaint.PREVIOUSKNOWLAGE.map(
                                      (item: any, index: number) => (
                                        <React.Fragment key={index}>
                                          {item.PREVIOUSNAME}
                                          {index <
                                          complaint.PREVIOUSKNOWLAGE.length - 1
                                            ? ', '
                                            : ''}
                                          {index ===
                                            complaint.PREVIOUSKNOWLAGE.length -
                                              1 &&
                                            index > 0 &&
                                            '.'}
                                        </React.Fragment>
                                      ),
                                    )
                                  : 'O nome de nenhum gestor foi informado.'}
                              </span>
                            </Typography>
                            <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                              Cargo(s):{' '}
                              <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                                {complaint.PREVIOUSKNOWLAGE &&
                                complaint.PREVIOUSKNOWLAGE.length > 0
                                  ? complaint.PREVIOUSKNOWLAGE.map(
                                      (item: any, index: number) => (
                                        <React.Fragment key={index}>
                                          {item.PREVIOUSROLE}
                                          {index <
                                          complaint.PREVIOUSKNOWLAGE.length - 1
                                            ? ', '
                                            : ''}
                                          {index ===
                                            complaint.PREVIOUSKNOWLAGE.length -
                                              1 &&
                                            index > 0 &&
                                            '.'}
                                        </React.Fragment>
                                      ),
                                    )
                                  : 'O nome de nenhum gestor foi informado.'}
                              </span>
                            </Typography>
                            <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                              Omissão?{' '}
                              <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                                {complaint.HASOMISSION === 1 ? 'Sim' : 'Não'}
                              </span>
                            </Typography>
                            <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                              Nome do(s) envolvido(s):{' '}
                              <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                                {complaint.INVOLVEDS &&
                                complaint.INVOLVEDS.length > 0
                                  ? complaint.INVOLVEDS.map(
                                      (item: any, index: number) => (
                                        <React.Fragment key={index}>
                                          {item.INVOLVEDNAME}
                                          {index <
                                          complaint.INVOLVEDS.length - 1
                                            ? ', '
                                            : ''}
                                          {index ===
                                            complaint.INVOLVEDS.length - 1 &&
                                            index > 0 &&
                                            '.'}
                                        </React.Fragment>
                                      ),
                                    )
                                  : 'Nenhum envolvido'}
                              </span>
                            </Typography>
                            <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                              Cargo do(s) envolvido(s):{' '}
                              {complaint.INVOLVEDS &&
                              complaint.INVOLVEDS.length > 0
                                ? complaint.INVOLVEDS.map(
                                    (item: any, index: number) => {
                                      return (
                                        <span
                                          className="text-gray200 font-semibold text-sm md:text-base mb-1"
                                          key={index}
                                        >
                                          {item.INVOLVEDROLE}
                                          {index <
                                          complaint.INVOLVEDS.length - 1
                                            ? ', '
                                            : ''}
                                          {index ===
                                            complaint.INVOLVEDS.length - 1 &&
                                            index > 0 &&
                                            '.'}
                                        </span>
                                      );
                                    },
                                  )
                                : 'Nenhum envolvido'}
                            </Typography>
                            <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                              Tipo de envolvimento:{' '}
                              <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                                {complaint.INVOLVEDS &&
                                complaint.INVOLVEDS.length > 0
                                  ? complaint.INVOLVEDS.map(
                                      (item: any, index: number) => (
                                        <React.Fragment key={index}>
                                          {item.INVOLVEDROLE === 1
                                            ? 'Testemunha'
                                            : item.INVOLVEDROLE === 2
                                            ? 'Vítima'
                                            : 'Envolvido'}
                                          {index <
                                          complaint.INVOLVEDS.length - 1
                                            ? ', '
                                            : ''}
                                          {index ===
                                            complaint.INVOLVEDS.length - 1 &&
                                            index > 0 &&
                                            '.'}
                                        </React.Fragment>
                                      ),
                                    )
                                  : 'Nenhum envolvido, testemunha ou vítima informado.'}
                              </span>
                            </Typography>
                          </>
                        )}
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Texto do Denunciante: {'   '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1 break-all">
                            {complaint.COMPLAINTTEXT}
                          </span>
                        </Typography>
                        <div className="">
                          <Typography className="font-inter text-gray200 text-sm md:text-base mt-3">
                            Anexos:{' '}
                            {complaint?.ATTACHMENTS &&
                            complaint.ATTACHMENTS.length > 0 ? (
                              complaint.ATTACHMENTS.map((item: any) => (
                                <a href={item.LINK} key={item.ATTACHMENT}>
                                  <span className="text-gray200 text-sm md:text-base">
                                    <Chip
                                      label={item.ATTACHMENT}
                                      color={'primary'}
                                      className={`${primaryColor} underline hover:${primaryColor}`}
                                    />{' '}
                                  </span>
                                </a>
                              ))
                            ) : (
                              <p className="text-blue text-sm md:text-base font-bold">
                                Nenhum arquivo foi anexado à denúncia.
                              </p>
                            )}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <Divider />
                    <div className="mt-3 flex justify-center align-items flex-col">
                      {/* aqui começa o accordion de comentarios publicos */}
                      <div>
                        <AccordionPublicComents
                          // ProtocolNumber={complaint.PROTOCOL}
                          complaint={complaint}
                          commentComplaint={commentComplaint}
                        />
                      </div>
                    </div>
                    <Divider />
                    {/*para comentários a denuncia, o denunciante terá acesso*/}
                    <div className="mt-3 flex justify-center align-items flex-col">
                      <Typography
                        className="font-inter text-gray200 text-center mb-2"
                        variant={isMobile ? 'h6' : 'h5'}
                      >
                        Adicionar comentários e anexos publicamente
                      </Typography>
                      <FormHelperText className="font-inter text-gray200 text-center mb-2">
                        Essa opção adiciona um novo comentário à denúncia e o
                        denunciante terá acesso.
                      </FormHelperText>

                      {complaint.STATUS === 3 ? null : (
                        <div className="flex justify-center">
                          <div className="flex justify-center flex-col mt-3">
                            <div className="flex justify-center align-center flex-col">
                              {selectedFiles.map(
                                (_file: any, index: React.Key | null | any) => (
                                  <div className="flex justify-center">
                                    <div key={index} className="mt-3 ">
                                      <input
                                        type="file"
                                        onChange={(e) =>
                                          handleFileChange(e, index)
                                        }
                                        accept=".png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .avi, .wmv, .mp4, .mp3, .wav, .m4a, .opus, .ogg"
                                        disabled={
                                          selectedFiles.length > 0 &&
                                          selectedFiles[index]
                                        }
                                      />

                                      {selectedFiles.length > 0 && (
                                        <IconButton
                                          disableRipple={true}
                                          type="button"
                                          onClick={removeLastFileInput}
                                          disabled={
                                            index !== selectedFiles.length - 1
                                          }
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
                                Os tipos de arquivos aceitos são png, jpg, jpeg,
                                pdf, doc, docx, xls, xlsx, avi, wmv, mp4, mp3,
                                wav, m4a, opus e ogg.
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
                                Adicione ou remova os campos para upload de
                                arquivo
                              </FormHelperText>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <StyledTextarea
                          aria-label="minimum height"
                          minRows={3}
                          className={`font-inter text-gray200 text-sm md:text-base w-full border-gray300`}
                          placeholder="Novo comentário"
                          value={commentComplaint}
                          onChange={handleCommentsComplaint}
                        />
                      </div>
                      <button
                        type="submit"
                        onClick={handleUpload}
                        className={`py-2 px-4 font-inter rounded-md text-sm md:text-lg radius text-white border-${primaryColor} hover:${primaryColor} ${primaryColor} mb-3`}
                      >
                        {' '}
                        Enviar
                      </button>
                    </div>
                    <Divider />
                    <div className="mt-3 flex justify-center align-items flex-col">
                      <Typography
                        className="font-inter text-gray200 text-center mb-2"
                        variant={isMobile ? 'h6' : 'h5'}
                      >
                        Comentários Privados
                      </Typography>
                      {/* aqui começa o accordion de comentarios privados */}
                      <div>
                        <AccordionPrivateComents
                          complaint={complaint}
                          commentComplaint={commentComplaint}
                        />
                      </div>
                    </div>
                    <Divider />
                    {/*para comentários a denuncia, o denunciante NÃO terá acesso*/}
                    <div className="mt-3 flex justify-center align-items flex-col">
                      <Typography
                        className="font-inter text-gray200 text-center mb-2"
                        variant={isMobile ? 'h6' : 'h5'}
                      >
                        Adicionar comentários privados
                      </Typography>
                      <FormHelperText className="font-inter text-gray200 text-center mb-2">
                        Essa opção adiciona um novo comentário à análise da
                        denúncia e somente os responsáveis terão acesso.
                      </FormHelperText>
                      {complaint.STATUS === 3 ? null : (
                        <div className="flex justify-center">
                          <div className="flex justify-center flex-col mt-3">
                            <div className="flex justify-center align-center flex-col">
                              {selectFilesPrivate.map(
                                (_file: any, index: React.Key | null | any) => (
                                  <div className="flex justify-center">
                                    <div key={index} className="mt-3 ">
                                      <input
                                        type="file"
                                        onChange={(e) =>
                                          handleFileChangePrivate(e, index)
                                        }
                                        accept=".png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .avi, .wmv, .mp4, .mp3, .wav, .m4a, .opus, .ogg"
                                        disabled={
                                          selectFilesPrivate.length > 0 &&
                                          selectFilesPrivate[index]
                                        }
                                      />

                                      {selectFilesPrivate.length > 0 && (
                                        <IconButton
                                          disableRipple={true}
                                          type="button"
                                          onClick={removeLastFileInputPrivate}
                                          disabled={
                                            index !==
                                            selectFilesPrivate.length - 1
                                          } // Desabilita se não for o último arquivo
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
                                Os tipos de arquivos aceitos são png, jpg, jpeg,
                                pdf, doc, docx, xls, xlsx, avi, wmv, mp4, mp3,
                                wav, m4a, opus e ogg.
                              </FormHelperText>
                              <p className="text-red font-bold font-inter text-center text-sm md:mt-3 mt-1">
                                {error}
                              </p>
                              <div className="flex flex-row justify-center">
                                <IconButton
                                  type="button"
                                  onClick={addFileInputPrivate}
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
                                Adicione ou remova os campos para upload de
                                arquivo
                              </FormHelperText>
                            </div>
                          </div>
                        </div>
                      )}
                      <div>
                        <StyledTextarea
                          aria-label="minimum height"
                          minRows={3}
                          className="font-inter text-gray200 text-sm md:text-base w-full border-gray300"
                          placeholder="Novo comentário"
                          value={commentSystem}
                          onChange={handleComentsSystem}
                        />
                      </div>
                      <button
                        type="submit"
                        onClick={handleUploadPrivate}
                        className={`py-2 px-4 font-inter rounded-md text-sm md:text-lg radius text-white border-${primaryColor} hover:${primaryColor} ${primaryColor} mb-3`}
                      >
                        {' '}
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </LayoutModal>
    </>
  );
}
