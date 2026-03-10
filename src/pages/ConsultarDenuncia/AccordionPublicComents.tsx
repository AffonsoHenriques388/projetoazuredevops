/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { API_BASE, API_URL } from '../../API/apiManager';
import axios from 'axios';
import {
  Box,
  useMediaQuery,
  Theme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
} from '@mui/material';
import { MdExpandMore } from 'react-icons/md';
import Loading from '../../components/Loading/Loading';
import { getThemeColors } from '../../themeColors';
import { useDataContext } from '../../context/DataContext';
import {
  IComentarioConsultaContext,
  useComentarioConsultaContext,
} from '../../context/ComentarioConsultaContext';
interface ProtocolNumber {
  ProtocolNumber: string;
}
interface PublicComents {
  length: number;
  map(
    arg0: (coment: any) => import('react/jsx-runtime').JSX.Element,
  ): React.ReactNode;
  LINK: string | undefined | any;
  ATTACHMENT?: string | any;
  COMMENT?: string;
  CREATEDON?: string;
  IDCOMENT?: number;
  CREATEDBY?: string;
}

export default function AccordionPublicComents(
  // { ProtocolNumber }: ProtocolNumber,

  { complaint }: any,
) {
  // const { data, setData } = useDataContext();
  const [newData, setNewData] = React.useState<PublicComents[]>([]);
  const { data, setData } =
    useComentarioConsultaContext() as IComentarioConsultaContext;
  const [loading, setLoading] = React.useState(false);
  const [expanded, setExpanded] = React.useState({
    panel1: true,
    panel2: false,
    panel3: false,
  });
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
  } = getThemeColors();

  // console.log(complaint);
  const handleChange = (panel: any) => (_event: any) => {
    if (panel === 'panel1') {
      setExpanded({ panel1: true, panel2: false, panel3: false });
    }
    if (panel === 'panel2') {
      setExpanded({ panel1: false, panel2: true, panel3: false });
    }
    if (panel === 'panel3') {
      setExpanded({ panel1: false, panel2: false, panel3: true });
    }
  };

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  // console.log(API_BASE);
  React.useEffect(() => {
    setLoading(true);

    const options = {
      gettype: 1,
      Base: API_BASE,
      ProtocolNumber: complaint,
      Accept: 'application/json',
    };
    // console.log(options);

    axios
      .get(API_URL + '/complaints/complaint/comments', { headers: options })
      .then((response) => {
        setLoading(false);
        // console.log(response.data.body);
        setData(response.data.body);
        // setNewData(response.data.body);
      });
  }, [complaint, setData]);
  const isDataEmpty = data.length === 0;

  // console.log(data);

  const BASE = 'USJ';
  return (
    <>
      <Accordion expanded={expanded.panel1} onChange={handleChange('panel1')}>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          expandIcon={<MdExpandMore size={23} />}
        >
          <Typography className="font-inter">Comentários Públicos</Typography>
        </AccordionSummary>
        <div>
          {loading ? (
            <div className="flex justify-center mt-2 mb-2">
              <Loading />
            </div>
          ) : isDataEmpty ? (
            <p className="font-inter font-semibold my-3 ml-3">
              Nenhum comentário foi inserido
            </p>
          ) : (
            data?.length > 0 &&
            data?.map((coment) => {
              return (
                // BITRSG5ZU4
                <Accordion>
                  <AccordionSummary expandIcon={<MdExpandMore size={23} />}>
                    <Typography className="font-inter">
                      Comentado por:{' '}
                      <span className={`${tertiaryColor} text-semibold`}>
                        {coment.CREATEDBY}
                      </span>{' '}
                      | Comentado em:{' '}
                      <span className={`${tertiaryColor} text-semibold`}>
                        {' '}
                        {coment.CREATEDON}
                      </span>
                    </Typography>
                  </AccordionSummary>
                  <div className="flex justify-start">
                    <AccordionDetails>
                      <Typography className="font-inter">
                        Comentários:{' '}
                        <span className="text-gray200 text-semibold">
                          {coment.COMMENT}
                        </span>
                      </Typography>
                      {API_BASE.toLowerCase() === 'usj' ? null : (
                        <Typography className="font-inter flex justify-start">
                          Anexo(s):
                          <p className="text-gray200 text-semibold">
                            {coment &&
                              coment.ATTACHMENT &&
                              (Array.isArray(coment.ATTACHMENT) ? (
                                coment.ATTACHMENT.map(
                                  (attachment: any, index: number) => (
                                    <div className="flex flex-row" key={index}>
                                      <a
                                        href={attachment.LINK}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <Chip
                                          label={attachment.ATTACHMENT}
                                          color={'primary'}
                                          className={`${secondaryColor} underline hover:bg-${secondaryColor} mt-1 mb-1`}
                                        />
                                      </a>
                                    </div>
                                  ),
                                )
                              ) : (
                                <div className="flex flex-row">
                                  <a
                                    href={coment?.ATTACHMENT?.LINK}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Chip
                                      label={coment?.ATTACHMENT?.ATTACHMENT}
                                      color={'primary'}
                                      className={`${secondaryColor} underline hover:bg-${secondaryColor} mt-1 mb-1`}
                                    />
                                  </a>
                                </div>
                              ))}
                          </p>
                        </Typography>
                      )}
                    </AccordionDetails>
                  </div>
                </Accordion>
              );
            })
          )}
        </div>
      </Accordion>
    </>
  );
}
