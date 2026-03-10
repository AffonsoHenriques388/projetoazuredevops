/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
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
interface ProtocolNumber {
  ProtocolNumber: string;
}
interface PublicComents {
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
  const [data, setData] = React.useState<PublicComents[]>([]);
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const [loading, setLoading] = React.useState(false);
  const [expanded, setExpanded] = React.useState({
    panel1: true,
    panel2: false,
    panel3: false,
  });

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

  React.useEffect(() => {
    setLoading(true);
    const options = {
      gettype: 1,
      Base: API_BASE,
      ProtocolNumber: complaint.PROTOCOL,
      Accept: 'application/json',
    };

    axios
      .get(API_URL + '/complaints/complaint/comments', { headers: options })
      .then((response) => {
        setLoading(false);
        // console.log(response.data.body);
        setData(response.data.body);
      });
  }, [complaint.PROTOCOL]);
  // console.log(data);
  const isDataEmpty = data.length === 0;

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
            <p className="font-inter font-semibold my-3">
              Nenhum comentário foi inserido
            </p>
          ) : (
            data.length > 0 &&
            data?.map((comment) => {
              // console.log(coment);
              return (
                // BITRSG5ZU4
                <Accordion>
                  <AccordionSummary expandIcon={<MdExpandMore size={23} />}>
                    <Typography className="font-inter">
                      Comentado por:{' '}
                      <span className={`semi-bold ${tertiaryColor}`}>
                        {comment.CREATEDBY}
                      </span>{' '}
                      | Comentado em:{' '}
                      <span className={`semi-bold ${tertiaryColor}`}>
                        {' '}
                        {comment.CREATEDON}
                      </span>
                    </Typography>
                  </AccordionSummary>
                  <div className="flex justify-start">
                    <AccordionDetails>
                      <Typography className="font-inter">
                        Comentários:{' '}
                        <span className="text-gray200 text-semibold">
                          {comment.COMMENT}
                        </span>
                      </Typography>
                      <Typography className="font-inter flex justify-start">
                        Anexo(s):
                        <p className="text-gray200 text-semibold flex gap-1 ml-2">
                          {comment?.ATTACHMENT.length > 0
                            ? comment?.ATTACHMENT.map(
                                (attachment: any, index: number) => {
                                  // console.log(attachment);
                                  return attachment.ATTACHMENT === '' ? (
                                    ''
                                  ) : (
                                    <div className="flex flex-row">
                                      <a
                                        key={index}
                                        href={attachment.LINK}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <Chip
                                          label={attachment.ATTACHMENT}
                                          color={'primary'}
                                          className={`${secondaryColor} underline hover:${secondaryColor} mt-1 mb-1`}
                                        />{' '}
                                      </a>
                                    </div>
                                  );
                                },
                              )
                            : ' Nenhum arquivo foi anexado.'}
                        </p>
                      </Typography>
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
