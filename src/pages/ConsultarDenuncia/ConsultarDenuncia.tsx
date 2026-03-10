/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Header from '../../components/Header/Header';
import Secondary from '../../components/Secondary/Secondary';
import {
  Typography,
  IconButton,
  Chip,
  Divider,
  useMediaQuery,
  Theme,
  FormHelperText,
} from '@mui/material';
import { getThemeColors } from '../../themeColors';
import { useReactToPrint } from 'react-to-print';
import { AiOutlinePrinter } from 'react-icons/ai';
import { IoArrowBackSharp } from 'react-icons/io5';
import Anexar from './Anexar';
import { useAuth } from '../../context/UserContext';
import AccordionPublicComents from './AccordionPublicComents';
import { API_BASE } from '../../API/apiManager';

export default function ConsultarDenuncia() {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
  } = getThemeColors();
  // const { data, setData, addNewData } =
  //   useComentarioConsultaContext() as IComentarioConsultaContext;
  const { protocol } = useAuth();
  const componentRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const isMobile = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('sm');
  });

  const backToHome = () => {
    window.location.href = '/';
  };
  const [data, setData] = React.useState<any>([protocol]);
  // console.log(data);
  // console.log(data);

  const BASE = 'USJ';

  return (
    <>
      <Header />
      <div className="flex justify-center md:w-3/5 w-1/6">
        <div className="flex justify-end">
          <IconButton onClick={backToHome}>
            <IoArrowBackSharp
              style={{
                color:
                  API_BASE === 'estrela'
                    ? '#F4A231'
                    : API_BASE === 'sbaraini'
                    ? '#009CDE'
                    : API_BASE === 'localhost'
                    ? '#009CDE'
                    : '#009CDE',
              }}
            />
          </IconButton>
        </div>
      </div>
      <Secondary>
        {data.map(
          (protocol: {
            INVOLVEDS: any;
            PREVIOUSKNOWLAGE: any;
            SUSPECTBUSINESSROLE: string;
            SUSPECTDEPARTMENT: string;
            PROTOCOL:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            STATUS: number;
            CREATEDON:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            COMPLAIERNAME:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            COMPLAINEREMAIL:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            COMPLAINERPHONENUMBER:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            SUSPECTNAME:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            COMPLAINTTYPE:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            LOCATION:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            FACTDATE:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            STILLHAPPENING: boolean;
            HASOMISSION: number;
            PREVIOUSNAME:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            PREVIOUSROLE:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            COMPLAINTTEXT:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            ATTACHMENTS: any[] | any;
          }) => (
            <div
              ref={componentRef}
              className="flex flex-col print:p-20 p-3 w-full"
            >
              <Typography
                className="font-inter text-gray200 text-center font-bold"
                variant={isMobile ? 'h6' : 'h5'}
              >
                Consultar Denúncia
              </Typography>
              <div className="flex justify-end mt-3 ">
                <IconButton onClick={handlePrint}>
                  <AiOutlinePrinter
                    size={24}
                    color={
                      API_BASE === 'estrela'
                        ? '#F4A231'
                        : API_BASE === 'sbaraini'
                        ? '#009CDE'
                        : API_BASE === 'localhost'
                        ? '#009CDE'
                        : '#009CDE'
                    }
                  />
                </IconButton>
              </div>
              <div className="flex justify-center">
                {/* aqui começa a identificação da denuncia */}

                <div>
                  <Typography
                    className="font-inter text-gray200 text-center"
                    variant={isMobile ? 'h6' : 'h5'}
                  >
                    Identificação
                  </Typography>
                  <div className="flex justify-between gap-5 mt-3 mb-3">
                    <Typography className="font-inter text-gray200 text-sm md:text-base">
                      Protocolo:{' '}
                      <span
                        className={`${tertiaryColor} font-semibold text-sm md:text-base`}
                      >
                        {protocol.PROTOCOL}
                      </span>
                    </Typography>
                    <Typography className="font-inter text-gray200 text-sm md:text-base">
                      Status:{' '}
                      <span className="text-green">
                        <Chip
                          label={
                            protocol.STATUS === 0
                              ? 'Em análise'
                              : protocol.STATUS === 1
                              ? 'Avaliação do Comitê'
                              : protocol.STATUS === 2
                              ? 'Finalização'
                              : 'Encerrada'
                          }
                          color={
                            protocol.STATUS === 0
                              ? 'error'
                              : protocol.STATUS === 1
                              ? 'warning'
                              : protocol.STATUS === 2
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
                        {protocol.CREATEDON}
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
                    <span className="text-gray200 font-semibold text-sm md:text-base">
                      {protocol.COMPLAIERNAME === null
                        ? 'Não informado'
                        : protocol.COMPLAIERNAME}
                    </span>
                  </Typography>
                  <Typography className="font-inter text-gray200 text-sm md:text-base">
                    E-mail:{' '}
                    <span className="text-gray200 font-semibold text-sm md:text-base">
                      {protocol.COMPLAINEREMAIL === null
                        ? 'Não informado'
                        : protocol.COMPLAINEREMAIL}
                    </span>
                  </Typography>
                  <Typography className="font-inter text-gray200 text-sm md:text-base">
                    Telefone:{' '}
                    <span className="text-gray200 font-semibold text-sm md:text-base">
                      {protocol.COMPLAINERPHONENUMBER === null
                        ? 'Não informado'
                        : protocol.COMPLAINERPHONENUMBER}
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
                <div className="flex justify-center md:flex-row flex-col">
                  <div>
                    <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                      Nome Denunciado:{' '}
                      <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                        {protocol.SUSPECTNAME === null
                          ? 'Não informado'
                          : protocol.SUSPECTNAME}
                      </span>
                    </Typography>
                    <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                      Cargo Denunciado:{' '}
                      <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                        {protocol.SUSPECTBUSINESSROLE === null
                          ? 'Não informado'
                          : protocol.SUSPECTBUSINESSROLE}
                      </span>
                    </Typography>
                    <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                      Departamento Denunciado:{' '}
                      <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                        {protocol.SUSPECTDEPARTMENT === null
                          ? 'Não informado'
                          : protocol.SUSPECTDEPARTMENT}
                      </span>
                    </Typography>
                  </div>
                  <Divider orientation="vertical" flexItem className="ml-3" />
                  {/* aqui começa o tipo de ocorrencia e afins
                   */}
                  <div className="md:ml-3 ml-0 mb-3">
                    <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                      Tipo da Ocorrência:{' '}
                      <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                        {protocol.COMPLAINTTYPE}
                      </span>
                    </Typography>
                    <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                      Local da Ocorrência:{' '}
                      <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                        {protocol.LOCATION}
                      </span>
                    </Typography>
                    <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                      Data do ocorrido:{' '}
                      <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                        {protocol.FACTDATE === null
                          ? 'Data não informada'
                          : protocol.FACTDATE}
                      </span>
                    </Typography>
                    {API_BASE.toLowerCase() === 'usj' ? null : (
                      <>
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Fato continua ocorrendo?{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {protocol.STILLHAPPENING === true ? 'Sim' : 'Não'}
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Liderança Envolvida/Tinha Conhecimento:{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {protocol.HASOMISSION === 1 ? 'Sim' : 'Não'}
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Nome do(s) Gestor(res):{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {protocol.PREVIOUSKNOWLAGE &&
                            protocol.PREVIOUSKNOWLAGE.length > 0
                              ? protocol.PREVIOUSKNOWLAGE.map(
                                  (item: any, index: number) => (
                                    <React.Fragment key={index}>
                                      {item.PREVIOUSNAME}
                                      {index <
                                      protocol.PREVIOUSKNOWLAGE.length - 1
                                        ? ', '
                                        : ''}
                                      {index ===
                                        protocol.PREVIOUSKNOWLAGE.length - 1 &&
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
                            {protocol.PREVIOUSKNOWLAGE &&
                            protocol.PREVIOUSKNOWLAGE.length > 0
                              ? protocol.PREVIOUSKNOWLAGE.map(
                                  (item: any, index: number) => (
                                    <React.Fragment key={index}>
                                      {item.PREVIOUSROLE}
                                      {index <
                                      protocol.PREVIOUSKNOWLAGE.length - 1
                                        ? ', '
                                        : ''}
                                      {index ===
                                        protocol.PREVIOUSKNOWLAGE.length - 1 &&
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
                            {protocol.HASOMISSION === 1 ? 'Sim' : 'Não'}
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Nome do(s) envolvido(s):{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {protocol.INVOLVEDS && protocol.INVOLVEDS.length > 0
                              ? protocol.INVOLVEDS.map(
                                  (item: any, index: number) => (
                                    <React.Fragment key={index}>
                                      {item.INVOLVEDNAME}
                                      {index < protocol.INVOLVEDS.length - 1
                                        ? ', '
                                        : ''}
                                      {index ===
                                        protocol.INVOLVEDS.length - 1 &&
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
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {protocol.INVOLVEDS.map((item: any) => {
                              return item.INVOLVEDROLE + ' ';
                            })}
                          </span>
                        </Typography>
                        <Typography className="font-inter text-gray200 text-sm md:text-base mb-1">
                          Tipo de envolvimento:{' '}
                          <span className="text-gray200 font-semibold text-sm md:text-base mb-1">
                            {protocol.INVOLVEDS.map((item: any) => {
                              // console.log(protocol.ATTACHMENTS);
                              return item.INVOLVEDROLE === 1
                                ? 'Testemunha'
                                : item.INVOLVEDROLE === 2
                                ? 'Vítima'
                                : 'Envolvido ';
                            })}
                          </span>
                        </Typography>
                      </>
                    )}
                  </div>
                </div>
                <Divider />
                {/* aqui começa os detalhes restantes da denuncia, como anexos e comentários. */}
                <div className="mt-3 flex justify-center align-items flex-col">
                  <Typography
                    className="font-inter text-gray200 text-center mb-2"
                    variant={isMobile ? 'h6' : 'h5'}
                  >
                    Detalhes da Ocorrência
                  </Typography>
                  {/* BITRSG5ZU4 */}

                  <div>
                    <Typography className="font-inter text-gray200 text-sm md:text-base">
                      Texto do Denunciante:{' '}
                      <span
                        className="text-gray200 font-semibold text-sm md:text-base"
                        style={{ wordBreak: 'break-all' }}
                      >
                        {protocol.COMPLAINTTEXT === '' ? (
                          <p className="text-blue text-sm md:text-base font-bold">
                            Nenhum comentário foi adicionado à denúncia.
                          </p>
                        ) : (
                          protocol.COMPLAINTTEXT
                        )}
                      </span>
                    </Typography>
                    {API_BASE.toLowerCase() === 'usj' ? null : (
                      <>
                        {' '}
                        <Typography className="font-inter text-gray200 text-sm md:text-base mt-3">
                          Anexos:{' '}
                          {protocol?.ATTACHMENTS &&
                          protocol.ATTACHMENTS.length > 0 ? (
                            protocol.ATTACHMENTS.map((item: any) => (
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
                      </>
                    )}
                  </div>
                  <AccordionPublicComents complaint={protocol.PROTOCOL} />
                </div>
              </div>
            </div>
          ),
        )}
      </Secondary>
      <div className="flex justify-center text-center mb-4">
        <Anexar />
      </div>
    </>
  );
}
