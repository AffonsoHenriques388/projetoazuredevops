/* eslint-disable no-extra-boolean-cast */
/* eslint-disable valid-typeof */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Header from '../../components/Header/Header';
import { Button, message } from 'antd';
import Input from '../../components/Input/Input';
import InputPrimary from '../../components/Input/InputPrimary';
import { MdCheck, MdClose } from 'react-icons/md';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import axios from 'axios';
import {
  useMediaQuery,
  Theme,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  SelectChangeEvent,
  Tabs,
  Modal,
  Tab,
  IconButton,
  Typography,
  Divider,
  OutlinedInput,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import DynamicFields from './DynamicField';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import DynamicFields2 from './DynamicField2';
import { API_BASE, API_URL } from '../../API/apiManager';
import { v4 as uuidv4 } from 'uuid';
import Loading from '../../components/Loading/Loading';
import ProtocolNumber from './Protocolo';

const atoLesivo = [
  {
    id: 1,
    name: 'Assédio Moral',
  },
  {
    id: 2,
    name: 'Agressão Física',
  },
  {
    id: 3,
    name: 'Assédio Sexual',
  },
  {
    id: 4,
    name: 'Discriminação',
  },
  { id: 5, name: 'Desvio de Comportamento' },
  {
    id: 6,
    name: 'Descumprimento de Normas e Políticas da Empresa',
  },
  {
    id: 7,
    name: 'Destruição ou danos aos Patriômios da Empresa',
  },
  {
    id: 8,
    name: 'Favorecimento ou Conflito de Interesses',
  },
  { id: 9, name: 'Fraude' },
  {
    id: 10,
    name: 'Relacionamento Íntimo com Subordinado',
  },
  {
    id: 11,
    name: 'Roubo, furto ou desvios de materiais',
  },
  {
    id: 12,
    name: 'Uso ou Tráfico de Substancia Ilícitas',
  },
  {
    id: 13,
    name: 'Vazamento ou uso indevido de informações confidenciais',
  },
  {
    id: 14,
    name: 'Violação de Leis Ambientais',
  },
  {
    id: 15,
    name: 'Violação de Leis Trabalhistas',
  },
  {
    id: 16,
    name: 'Pagamento ou Recebimento Impróprio',
  },
  {
    id: 17,
    name: 'Lavagem de Dinheiro e/ou Corrupção',
  },
  {
    id: 18,
    name: 'Uso indevido de dados pessoais (LGPD)',
  },
  {
    id: 19,
    name: 'Outros',
  },
];

interface Tipology {
  IDCOMPLAINTTYPE: number;
  COMPLAINT: string;
  RESOLUTIONTIME: number;
}

/* 
React.useEffect(() => {
  const options = {
    headers: {
      Base: API_BASE,
      Accept: 'application/json',
    },
  };
  setLoading(true);
  axios
    .get<GetCompany[]>(API_URL + `/companies`, options)
    .then((res) => {
      // console.log(res.data);
      setData(res.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log('Erro no GET.', error);
    });
}, []); */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px dashed #009CDE',
  // boxShadow: 24,
  p: 5,
};

function TabPanel(props: TabPanelProps) {
  const [tipologies, setTipologies] = useState<Tipology | null>(null);

  React.useEffect(() => {
    const options = {
      headers: {
        Base: API_BASE,
        Accept: 'application/json',
        IDCompany: 1,
      },
    };

    axios
      .get(API_URL + `/companies/tipology`, options)
      .then((res) => setTipologies(res.data.body));
  }, []);

  const { children, value, index, ...other } = props;

  //variável p verificar se a tela está em tamanho mobile 768px
  const isMobile = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('sm');
  });

  return (
    <div
      className="tab-panel"
      role="tabpanel"
      style={{ width: isMobile ? '100%' : '950px' }}
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className="tab-panel-content">
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
interface UploadFiles {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
  fileHash: string;
}
interface VictimData {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  role: string;
  type: string;
}

interface PreviousKnowData {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  role: string;
}

const NovaDenuncia = () => {
  const [open, setOpen] = React.useState(false);
  const [suspectName, setSuspectName] = React.useState('');
  const [suspectDepartment, setSuspectDepartment] = React.useState('');
  const [suspectRole, setSuspectRole] = React.useState('');
  //array de empresas p select
  const [companies, setCompanies] = React.useState([]);
  //value do select, usar p fazer o post
  const [company, setCompany] = React.useState('');
  const [diaDenuncia, setDiaDenuncia] = React.useState<string | boolean>('');
  const [dataDenuncia, setDataDenuncia] = React.useState<any>();
  const [value, setValue] = React.useState<any>();
  const [password, setPassword] = React.useState('');
  const [isEightCharacters, setIsEightCharacters] = React.useState(false);
  const [hasTwoNumbers, setHasTwoNumbers] = React.useState(false);
  const [hasSpecialCharacter, setHasSpecialCharacter] = React.useState(false);
  const [hasUppercaseLetter, setHasUppercaseLetter] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState('');
  //se algum funcionario ja foi informado dos fatos anteriormente
  const [hasOmission, setHasOmission] = React.useState<string | boolean>('');
  //arquivos anexados
  const [selectedFiles, setSelectedFiles] = React.useState<File[] | any>([]);
  //manter anonimo ou nao (input radio)
  const [dadosDenunciante, setDadosDenunciante] = React.useState<
    string | boolean
  >('');
  const [emailDenunciante, setEmailDenunciante] = useState<string | boolean>(
    '',
  );
  const [emailAnonimato, setEmailAnonimato] = useState<string>('');
  const [location, setLocation] = React.useState('');
  const [complaintText, setComplaintText] = React.useState('');
  //possui envolvidos, vitimas ou testemunhas
  const [envolvidos, setEnvolvidos] = React.useState<string | boolean>('');
  const [IDComplaintType, setIDComplaintType] = React.useState('');
  const [complainerName, setComplainerName] = React.useState('');
  const [complainerEmail, setComplainerEmail] = React.useState('');
  const [complainerPhone, setComplainerPhone] = React.useState('');

  const [tipologies, setTipologies] = useState<Tipology[]>([]);

  //index do tab
  const [tab, setTab] = React.useState(0);
  //handle change do tab
  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const [stillHappening, setStillHappening] = React.useState<string | boolean>(
    '',
  );
  //valores do select de conhecimento, input nome e cargo
  const [victimData, setVictimData] = React.useState<VictimData[]>([]);
  const [keepVictimData, setKeepVictimData] = React.useState<VictimData[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  // Função para lidar com a mudança nos campos
  const handleFieldsChange = (novosCampos: any) => {
    setVictimData(novosCampos);
  };

  const [loading, setLoading] = React.useState<boolean>(false);

  const [uploadFiles, setUploadFiles] = React.useState<UploadFiles[]>([]);

  //values input nome e cargo de gerente, socio, ou funcionario ja foram informados
  const [previousKnowData, setPreviousKnowData] = React.useState<
    PreviousKnowData[]
  >([]);
  //onchange input nome e cargo de gerente, socio, ou funcionario ja foram informados
  const handleFieldsChange2 = (novosCampos: any) => {
    setPreviousKnowData(novosCampos);
  };
  const [fileNames, setFileNames] = useState<string[]>([]);
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

    const newFileNames = [...fileNames];
    newFileNames[index] = file.name;
    setFileNames(newFileNames);
  };
  // console.log(uploadFiles, 'uploadFiles');
  // console.log(selectedFiles, 'selectedFiles');
  const generateUUID = () => {
    return uuidv4();
  };

  const getFileExtension = (filename: string | string[]) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  };

  const getPreSignedURL = async (hashName: string, fileType: string) => {
    const headers = {
      'Content-Type': 'application/json',
      Base: API_BASE,
      CompanyName: API_BASE,
      FileName: hashName,
      FileType: fileType,
    };

    const response = await fetch(
      API_URL + '/complaints/complaint/upload/presignedurl',
      {
        method: 'GET',
        headers: headers,
      },
    );

    const data = await response.json();
    // console.log(data);
    if (data.statusCode === 600) {
      setError('Tipo de arquivo não permitido. Tente novamente');
    } else {
      setError(null);
    }
    return data;
  };

  const handleUpload = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (selectedFiles.length === 0) {
      handleSubmit();
      // console.log('linha 321');
    } else {
      // console.log('aqui linha323');
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

          if (response.status === 200) {
            message.success('Arquivo enviado com sucesso!');
          }
        } catch (error) {
          console.log(error, 'error');
        }
      });
      handleSubmit();
    }
  };

  const [protocol, setProtocol] = React.useState<string>('');

  const handleSubmit = async () => {
    setLoading(true);
    const headers = {
      hasomission: hasOmission === '' ? 0 : hasOmission, //se alguem tinha info dos fatos
      idcompany: company, //empresa
      base: API_BASE,
      idcomplainttype: IDComplaintType, // id do tipo de ato lesivo
      stillhappening: stillHappening, // se continua ocorrendo
      factdate: dataDenuncia, // data da ocorrencia
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    let raw = JSON.stringify({
      previousKnowData: previousKnowData,
      victimData: victimData, //
      uploadFiles: uploadFiles, // arquivos da denuncia, como video, audio e fotos
      suspectName: suspectName, // nome do suspeito
      suspectDepartment: suspectDepartment, //departamento do supeito
      location: location, //local que ocorreu a infracao
      suspectRole: suspectRole, //cargo do suspeito
      complaintText: complaintText, // texto da denuncia
      complainerName: complainerName, // nome da vitima
      complainerEmail: complainerEmail, // email da vitima
      complainerPhone: complainerPhone, // telefone da vitima
      protocolPassword: confirmPassword, // senha para acompanhar denuncia
      complaintFup: emailAnonimato, //email para quando a pessoa escolheu anonimato, mas quer receber infos sobre a denuncia
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
        API_URL + '/complaints/complaint',
        requestOptions,
      );

      const data = await response.json();
      // console.log(data);
      if (response.status && data.statusCode === 200) {
        message.success('Denúncia enviada com sucesso!');
        setLoading(false);

        setProtocol(data.protocol);

        setOpen(true);
      } else {
        message.error('Erro ao enviar denúncia!');
        setLoading(false);
      }
    } catch (error) {
      message.error('Erro ao enviar denúncia!');
    }
  };
  const addFileInput = () => {
    setSelectedFiles([...selectedFiles, null!]);
  };

  const removeLastFileInput = () => {
    const newFiles = [...selectedFiles];
    const newFilesUpload = [...uploadFiles];

    newFiles.pop();
    newFilesUpload.pop();

    setUploadFiles(newFilesUpload);
    setSelectedFiles(newFiles);
  };

  //variável p verificar se a tela está em tamanho mobile 768px
  const isMobile = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('sm');
  });
  //função que lida com o change do select de empresa
  const handleChangeCompany = (e: SelectChangeEvent<any>) => {
    const newValue = e.target.value;
    setCompany(newValue);
  };

  //função que lida com o change do select de ato lesivo
  const handleChangeAto = (e: SelectChangeEvent<any>) => {
    const newValue = e.target.value;
    setIDComplaintType(newValue);
  };

  //função que lida com o change do datepicker e transforma a data em string no formato dd-mm-aaaa
  const handleDataDenuncia = (date: any) => {
    setValue(date);
    const dateobject = {
      dia: date.$D,
      mes: date.$M + 1,
      ano: date.$y,
    };
    const dataFormatada = `${dateobject.dia
      .toString()
      .padStart(2, '0')}-${dateobject.mes
      .toString()
      .padStart(2, '0')}-${dateobject.ano.toString()}`;

    setDataDenuncia(dataFormatada);
  };

  function BackPaginaInicial() {
    window.location.href = '/';
  }

  const handleNext = () => {
    setTab((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setTab((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setIsEightCharacters(value.length >= 8);
    setHasTwoNumbers((value.match(/\d/g) || []).length >= 2);
    setHasSpecialCharacter(/[!@#$%^&*(),.?":{}|<>]/.test(value));
    setHasUppercaseLetter(/[A-Z]/.test(value));
  };

  const handleConfirmPass = (value: string) => {
    setConfirmPassword(value);
  };

  React.useEffect(() => {
    axios
      .get(API_URL + '/companies', {
        headers: {
          Base: API_BASE,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setCompanies(response.data);
      });
  }, []);

  // UseEffect que lista todas as tipologias baseadas na empresa selecionada
  useEffect(() => {
    if (company) {
      const options = {
        headers: {
          Base: API_BASE,
          Accept: 'application/json',
          IDCompany: company,
        },
      };

      axios
        .get(API_URL + `/companies/tipology`, options)
        .then((res) => setTipologies(res.data.body));
    }
  }, [company]);

  // console.log(uploadFiles, 'upload files');
  // console.log(selectedFiles, 'selectedFiles');

  // console.log(emailAnonimato);

  const BASE = 'usj';
  return (
    <React.Fragment>
      <Header />
      <form
        className="flex justify-center align-center mb-6 mt-3"
        onSubmit={handleUpload}
      >
        <div className="bg-gray100 md:p-5 p-2 rounded md:shadow-md shadow">
          <div className="flex justify-center align-center md:p-5 p-2 gap-5 bg-white rounded md:shadow-md shadow flex-col">
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider' }}
              className="p-3 flex justify-center align-center"
            >
              <Tabs
                className="flex flex-col"
                variant={isMobile ? 'scrollable' : 'standard'}
                value={tab}
                onChange={handleChangeTab}
              >
                <Tab
                  label="Dados Denunciado"
                  {...a11yProps(0)}
                  className="normal-case font-inter font-medium"
                />
                <Tab
                  label="Dados da Denúncia"
                  {...a11yProps(0)}
                  className="normal-case font-inter font-medium"
                />
                <Tab
                  label={
                    API_BASE.toLowerCase() === 'usj'
                      ? 'Envio da Denúncia'
                      : 'Anexos de Denuncias'
                  }
                  {...a11yProps(0)}
                  className="normal-case font-inter font-medium"
                />
              </Tabs>
            </Box>
            {/* dados do denunciado começa aquii! */}
            <TabPanel value={tab} index={0}>
              <form>
                <div className="flex flex-row gap-3 justify-center align-center">
                  <Input
                    placeholder="Nome do Denunciado(a)"
                    className="inputProtocolo text-sm md:text-base"
                    $inputWidth={isMobile ? '100%' : '310px'}
                    id="inputNome"
                    name="nome"
                    required
                    value={suspectName}
                    onChange={(e) => setSuspectName(e.target.value)}
                  />
                  <Input
                    placeholder="Cargo do Denunciado(a)"
                    required
                    className="inputProtocolo text-sm md:text-base"
                    $inputWidth={isMobile ? '100%' : '310px'}
                    id="inputCargo"
                    name="cargo"
                    value={suspectRole}
                    onChange={(e) => setSuspectRole(e.target.value)}
                  />
                  <Input
                    placeholder="Departamento do Denunciado(a)"
                    required
                    className="inputProtocolo text-sm md:text-base"
                    $inputWidth={isMobile ? '100%' : '310px'}
                    id="inputCargo"
                    name="departamento-suspeito"
                    value={suspectDepartment}
                    onChange={(e) => setSuspectDepartment(e.target.value)}
                  />
                </div>
                <div className="mt-3 w-full">
                  {companies.length > 0 ? (
                    <FormControl
                      size="small"
                      style={{
                        maxWidth: isMobile ? '343px' : '100%',
                        minWidth: isMobile ? '100%' : '100%',
                      }}
                    >
                      <Select
                        onChange={handleChangeCompany}
                        value={company}
                        id="empresa-select"
                      >
                        {companies?.map((company: any) => (
                          <MenuItem
                            value={company.IDCOMPANY}
                            key={company.IDCOMPANY}
                          >
                            {`${company.CNPJ.replace(/\D/g, '').replace(
                              /^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/,
                              '$1.$2.$3/$4-$5',
                            )} - ${company.RAZAOSOCIAL}`}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Selecione uma empresa.</FormHelperText>
                    </FormControl>
                  ) : null}
                  <div className=" mt-3 w-full">
                    <FormControl fullWidth>
                      <Input
                        name="localOcorrencia"
                        placeholder="Local onde ocorreu a denúncia"
                        className="inputProtocolo text-sm md:text-base"
                        id="local-ocorrencia"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      <FormHelperText>
                        Local onde ocorreu a denúncia.
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div
                    id="checkbox-anonimato"
                    className="flex justify-center items-center mt-3 flex-col"
                  >
                    <p className="font-inter text-gray200 text-sm md:text-base">
                      Prosseguir com a reclamação em anonimato?
                    </p>
                    <div className="flex flex-row gap-2 mt-2">
                      <label
                        htmlFor="manterAnonimato"
                        className="font-inter text-gray200 text-center text-sm md:text-base"
                      >
                        <input
                          type="radio"
                          name="manter-anonimato"
                          id="manterAnonimato"
                          value="manter-anonimato"
                          checked={dadosDenunciante === 'manter-anonimato'}
                          onChange={(e) => setDadosDenunciante(e.target.value)}
                        />
                        {'   '}
                        Manter o anonimato
                      </label>
                      <label
                        htmlFor="semAnonimato"
                        className="font-inter text-gray200 text-center text-sm md:text-base"
                      >
                        <input
                          type="radio"
                          name="sem-anonimato"
                          id="semAnonimato"
                          value="sem-anonimato"
                          checked={dadosDenunciante === 'sem-anonimato'}
                          onChange={(e) => setDadosDenunciante(e.target.value)}
                        />
                        {'   '}
                        Não manter o anonimato
                      </label>
                    </div>
                    {dadosDenunciante === 'sem-anonimato' ? (
                      <div>
                        <div className="flex flex-row gap-2">
                          <Input
                            id="nome"
                            name="nome"
                            type="text"
                            className="inputProtocolo"
                            required
                            placeholder="Nome"
                            $inputWidth={isMobile ? '100%' : '300px'}
                            value={complainerName}
                            onChange={(e) => setComplainerName(e.target.value)}
                          />

                          <Input
                            id="email"
                            name="email"
                            required
                            type="e-mail"
                            className="inputProtocolo"
                            placeholder="E-mail"
                            $inputWidth={isMobile ? '100%' : '300px'}
                            value={complainerEmail}
                            onChange={(e) => setComplainerEmail(e.target.value)}
                          />
                          <Input
                            id="numero-telefone"
                            type="text"
                            required
                            name="numero-telefone"
                            className="inputProtocolo"
                            placeholder="(XX) XXXXX-XXXX"
                            maxLength={11}
                            $inputWidth={isMobile ? '100%' : '300px'}
                            value={complainerPhone}
                            onChange={(e) => setComplainerPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : null}

                    {dadosDenunciante === 'manter-anonimato' ? (
                      <div>
                        <Typography className="font-inter text-gray200 text-center text-base md:text-md flex flex-col mt-4">
                          {' '}
                          Gostaria de informar um e-mail para acompanhamento da
                          denuncia?
                        </Typography>
                        <div className="flex flex-row gap-2 mt-2 justify-center">
                          <label
                            className="font-inter text-gray200 text-center text-sm md:text-base"
                            htmlFor="informarEmail"
                          >
                            <input
                              type="radio"
                              id="informarEmail"
                              name="informarEmail"
                              className="mr-1"
                              value="comEmail"
                              checked={emailDenunciante === 'comEmail'}
                              onChange={(e) =>
                                setEmailDenunciante(e.target.value)
                              }
                            />
                            Sim
                          </label>

                          <label
                            className="font-inter text-gray200 text-center text-sm md:text-base"
                            htmlFor="naoInformarEmail"
                          >
                            <input
                              type="radio"
                              id="naoInformarEmail"
                              name="naoInformarEmail"
                              className="mr-1"
                              value="semEmail"
                              checked={emailDenunciante === 'semEmail'}
                              onChange={(e) =>
                                setEmailDenunciante(e.target.value)
                              }
                            />
                            Não
                          </label>
                        </div>
                      </div>
                    ) : null}

                    {emailDenunciante === 'comEmail' &&
                    dadosDenunciante === 'manter-anonimato' ? (
                      <>
                        {' '}
                        <Input
                          id="emailDenunciante"
                          name="emailDenunciante"
                          type="text"
                          className="inputProtocolo"
                          required
                          placeholder="E-mail"
                          $inputWidth={isMobile ? '100%' : '300px'}
                          value={emailAnonimato}
                          onChange={(e) => setEmailAnonimato(e.target.value)}
                        />
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="flex justify-end">
                  <IconButton onClick={handleNext}>
                    <ArrowRightOutlined
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  </IconButton>
                </div>
              </form>
            </TabPanel>
            {/* dados da denuncia começa aquiii!!! */}
            <TabPanel value={tab} index={1}>
              <div className="w-full ">
                <p className="font-inter text-gray-200 text-center mb-2 text-sm md:text-base">
                  Informe o ato lesivo da denúncia:
                </p>
                <div>
                  <FormControl fullWidth size="small">
                    <Select
                      disabled={!Boolean(company)}
                      className="text-slate-900"
                      onChange={handleChangeAto}
                      value={IDComplaintType}
                      id="ato-lesivo-select"
                    >
                      {tipologies.map((tipology) => (
                        <MenuItem
                          value={tipology.IDCOMPLAINTTYPE}
                          key={tipology.IDCOMPLAINTTYPE}
                        >
                          {tipology.COMPLAINT}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Selecione o ato lesivo da denúncia.
                    </FormHelperText>
                  </FormControl>
                </div>
              </div>
              <div className="flex flex-row gap-2 justify-center align-center mt-3">
                {' '}
                <div>
                  <input
                    type="radio"
                    id="comData"
                    name="dataDenuncia"
                    value="comData"
                    checked={diaDenuncia === 'comData'}
                    onChange={(e) => setDiaDenuncia(e.target.value)}
                  />
                  {'  '}
                  <label
                    htmlFor="comData"
                    className="font-inter text-gray200 text-center text-sm md:text-base"
                  >
                    Não consigo informar a data do evento da denúncia.
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="semData"
                    name="dataDenuncia"
                    value="semData"
                    checked={diaDenuncia === 'semData'}
                    onChange={(e) => setDiaDenuncia(e.target.value)}
                  />
                  {'  '}
                  <label
                    htmlFor="semData"
                    className="font-inter text-gray200 text-center text-sm md:text-base"
                  >
                    Consigo informar a data do evento da denúncia.
                  </label>
                </div>
              </div>
              {diaDenuncia === 'semData' || '' ? (
                <div className="w-full flex justify-center flex-col align-center mt-3">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Selecione uma data"
                      value={value}
                      format="DD/MM/YYYY"
                      maxDate={dayjs()}
                      defaultValue={dayjs()}
                      onChange={handleDataDenuncia}
                    />
                  </LocalizationProvider>
                  <FormHelperText>
                    Selecione a data do evento da denúncia
                  </FormHelperText>
                </div>
              ) : null}
              <div className="w-full mt-3 flex justify-center align-center">
                <TextareaAutosize
                  className="w-full text-sm font-normal font-sans leading-5 p-3 rounded-xl rounded-br-none shadow-md shadow-slate-100 focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 focus:border-blue-500 bg-white text-slate-900 focus-visible:outline-0"
                  placeholder="Discorra sobre o evento da denúncia"
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  name="textoDenuncia"
                />
              </div>
              <div className="flex justify-center align-center text-center flex-col mt-3">
                <p className="font-inter text-gray200 text-center text-sm md:text-base">
                  O ato da denúncia continua ocorrendo?
                </p>
                <form className="flex flex-row gap-3 justify-center">
                  <label
                    htmlFor="continua-ocorrendo"
                    className="font-inter text-gray200 text-center"
                  >
                    <input
                      type="radio"
                      name="continua-ocorrendo"
                      value="1"
                      id="continua-ocorrendo"
                      checked={stillHappening === '1'}
                      onChange={(e) => setStillHappening(e.target.value)}
                    />
                    {'  '}
                    Sim
                  </label>
                  <label
                    htmlFor="nao-continua-ocorrendo"
                    className="font-inter text-gray200 text-center"
                  >
                    <input
                      type="radio"
                      name="nao-continua-ocorrendo"
                      value="0"
                      id="nao-continua-ocorrendo"
                      checked={stillHappening === '0'}
                      onChange={(e) => setStillHappening(e.target.value)}
                    />
                    {'  '}
                    Não
                  </label>
                </form>
              </div>
              {API_BASE.toLowerCase() === 'usj' ? null : (
                <div className="flex justify-center align-center text-center flex-col mt-3">
                  {' '}
                  <p className="font-inter text-gray200 text-sm md:text-base">
                    Algum sócio, diretor, gerente ou funcionário já foi
                    informado dos fatos?
                  </p>
                  <form id="sim">
                    <label htmlFor="sim" className="text-gray200 font-inter">
                      <input
                        type="radio"
                        name="nao"
                        value="1"
                        id="com-conhecimento"
                        checked={hasOmission === '1'}
                        onChange={(e) => setHasOmission(e.target.value)}
                      />{' '}
                      Sim
                    </label>
                    {'      '}
                    <label htmlFor="nao" className="text-gray200 font-inter">
                      <input
                        type="radio"
                        name="nao"
                        value="0"
                        id="sem-conhecimento"
                        checked={hasOmission === '0'}
                        onChange={(e) => setHasOmission(e.target.value)}
                      />{' '}
                      Não
                    </label>
                  </form>
                  {hasOmission === '1' ? (
                    <div>
                      <DynamicFields2 onFieldsChange2={handleFieldsChange2} />
                    </div>
                  ) : null}
                </div>
              )}

              {API_BASE.toLowerCase() === 'usj' ? null : (
                <div className="flex justify-center align-center text-center flex-col mt-3">
                  <p className="font-inter text-gray200 text-sm md:text-base">
                    Existem outras vítimas, testemunhas ou outros envolvidos
                    nesta denúncia?
                  </p>
                  <form id="nao">
                    <label htmlFor="sim" className="text-gray200 font-inter">
                      <input
                        type="radio"
                        name="sim"
                        value="possuem-envolvidos"
                        id="com-envolvidos"
                        checked={envolvidos === 'possuem-envolvidos'}
                        onChange={(e) => setEnvolvidos(e.target.value)}
                      />{' '}
                      Sim
                    </label>
                    {'      '}
                    <label htmlFor="nao" className="text-gray200 font-inter">
                      <input
                        type="radio"
                        name="nao"
                        value="nao-possuem-envolvidos"
                        id="sem-envolvidos"
                        checked={envolvidos === 'nao-possuem-envolvidos'}
                        onChange={(e) => setEnvolvidos(e.target.value)}
                      />{' '}
                      Não
                    </label>
                  </form>
                </div>
              )}

              {API_BASE.toLowerCase() === 'usj' ? null : envolvidos ===
                'possuem-envolvidos' ? (
                <div>
                  {/* <Fields /> */}
                  <DynamicFields onFieldsChange={handleFieldsChange} />
                </div>
              ) : null}

              <div className="flex gap-2 justify-between">
                <IconButton onClick={handleBack}>
                  <ArrowLeftOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                </IconButton>
                <IconButton onClick={handleNext}>
                  <ArrowRightOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                </IconButton>
              </div>
            </TabPanel>

            {/* anexos da denuncia começa aquiii! */}
            <TabPanel value={tab} index={2}>
              <div className="flex justify-center flex-col align-center">
                {API_BASE.toLowerCase() === 'usj' ? null : (
                  <>
                    {' '}
                    <p className="font-inter text-gray200 text-center text-sm md:text-base">
                      Possui algum vídeo, documento, áudio para anexar à
                      denúncia?
                    </p>
                    <div className="flex justify-center">
                      <div className="flex justify-center flex-col mt-3">
                        <div className="flex justify-center align-center flex-col">
                          {selectedFiles?.map(
                            (_file: any, index: React.Key | null | any) => (
                              <div className="flex justify-center">
                                <div key={index} className="mt-3 flex">
                                  <div className="text-center">
                                    <input
                                      className="text-transparent"
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
                                    {fileNames[index] && (
                                      <p>{fileNames[index]}</p>
                                    )}
                                  </div>
                                  {selectedFiles.length > 0 && (
                                    <IconButton
                                      disableRipple={true}
                                      type="button"
                                      onClick={removeLastFileInput}
                                      disabled={
                                        index !== selectedFiles.length - 1
                                      } // desabilita se não for o último arquivo
                                    >
                                      <AiOutlineMinus
                                        style={{ color: '#009CDE' }}
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
                            pdf, doc, docx, xls, xlsx, avi, wmv, mp4, mp3, wav,
                            m4a, opus e ogg.
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
                                  backgroundColor: '#009CDE',
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
                  </>
                )}

                <div className="flex justify-center flex-col items-center align-center">
                  <div className="flex justify-center align-center items-center flex-col w-1/2">
                    <Typography className="font-inter text-gray200 text-center mt-3 mb-3 text-sm md:text-base">
                      Crie uma senha para acompanhar o andamento da denúncia
                    </Typography>
                    <InputPrimary
                      id="senhaProtocolo"
                      required={false}
                      type="password"
                      value={password}
                      placeholder="Senha"
                      onChange={handlePasswordChange}
                      iconStart={undefined}
                    />
                    <FormHelperText className="text-center">
                      Senha para acompanhar o andamento da denúncia.
                    </FormHelperText>
                  </div>
                  <div className="flex justify-center align-center items-center flex-col w-1/2">
                    <InputPrimary
                      id="senhaProtocolo"
                      required={false}
                      type="password"
                      value={confirmPassword}
                      className="inputProtocolo"
                      placeholder="Confirmar senha"
                      onChange={handleConfirmPass}
                      iconStart={undefined}
                    />
                    <FormHelperText className="text-center">
                      As senhas devem ser iguais.
                    </FormHelperText>
                  </div>
                  <div className="flex flex-row justify-between pt-4 pb-4 sm:flex-row">
                    <div className="flex flex-col gap mx-1">
                      <div className="flex justify-center items-center gap-2">
                        {isEightCharacters ? (
                          <MdCheck size={15} color="#68bb59" />
                        ) : (
                          <MdClose size={15} color="#ed3419" />
                        )}
                        <Typography
                          variant="h5"
                          color="#252525"
                          fontSize="14px"
                          className="text-inter"
                          fontWeight="regular"
                        >
                          8 caracteres
                        </Typography>
                      </div>
                      <div className="flex justify-start items-center gap-2">
                        {hasTwoNumbers ? (
                          <MdCheck size={15} color="#68bb59" />
                        ) : (
                          <MdClose size={15} color="#ed3419" />
                        )}
                        <Typography
                          variant="h5"
                          color="#252525"
                          fontSize="14px"
                          className="text-inter"
                          fontWeight="regular"
                        >
                          2 números
                        </Typography>
                      </div>
                    </div>
                    <div className="flex flex-col gap">
                      <div className="flex justify-start items-center gap-2">
                        {hasSpecialCharacter ? (
                          <MdCheck size={15} color="#68bb59" />
                        ) : (
                          <MdClose size={15} color="#ed3419" />
                        )}
                        <Typography
                          variant="h5"
                          color="#252525"
                          fontSize="14px"
                          className="text-inter"
                          fontWeight="regular"
                        >
                          1 caracter especial
                        </Typography>
                      </div>
                      <div className="flex justify-start items-center gap-2">
                        {hasUppercaseLetter ? (
                          <MdCheck size={15} color="#68bb59" />
                        ) : (
                          <MdClose size={15} color="#ed3419" />
                        )}
                        <Typography
                          variant="h5"
                          color="#252525"
                          fontSize="14px"
                          className="text-inter"
                          fontWeight="regular"
                        >
                          1 letra maiúscula
                        </Typography>
                      </div>
                      <div className="flex justify-center items-center text-center gap-2">
                        {confirmPassword === password &&
                        password !== '' &&
                        confirmPassword !== '' ? (
                          <MdCheck size={15} color="#68bb59" />
                        ) : (
                          <MdClose size={15} color="#ed3419" />
                        )}
                        <Typography
                          variant="h5"
                          color="#252525"
                          fontSize="14px"
                          className="text-inter"
                          fontWeight="regular"
                        >
                          As senhas devem ser iguais
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4 ">
                  {loading ? (
                    <Loading />
                  ) : (
                    <button
                      type="submit"
                      onClick={handleUpload}
                      disabled={
                        password !== '' &&
                        isEightCharacters &&
                        hasTwoNumbers &&
                        hasSpecialCharacter &&
                        hasUppercaseLetter &&
                        confirmPassword === password
                          ? false
                          : true
                      }
                      className=" p-3 text-inter rounded-md text-sm md:text-lg radius text-white border-green hover:bg-green10 bg-green disabled:bg-gray100 disabled:text-gray disabled:border-gray100"
                    >
                      Enviar Denúncia
                    </button>
                  )}
                </div>
              </div>

              <IconButton onClick={handleBack}>
                <ArrowLeftOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              </IconButton>
            </TabPanel>
          </div>
        </div>
      </form>
      <div className="flex justify-center mb-2">
        <Button onClick={BackPaginaInicial} size={isMobile ? 'small' : 'large'}>
          Voltar
        </Button>
      </div>

      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ProtocolNumber
            protocol={protocol}
            confirmPassword={confirmPassword}
          />
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default NovaDenuncia;
