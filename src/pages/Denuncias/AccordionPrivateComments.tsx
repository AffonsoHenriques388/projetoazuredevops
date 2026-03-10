/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { API_BASE, API_URL } from '../../API/apiManager';
import axios from 'axios';
import { getThemeColors } from '../../themeColors';

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

interface PrivateComents {
  LINK: string | undefined | any;
  ATTACHMENT?: string | any;
  COMMENT?: string;
  CREATEDON?: string;
  IDCOMENT?: number;
  CREATEDBY?: string;
}

export default function AccordionPrivateComents(
  // { ProtocolNumber }: ProtocolNumber,
  { complaint }: any,
) {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const [data, setData] = React.useState<PrivateComents[]>([]);
  const [loading, setLoading] = React.useState(false);

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

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
        // console.log(response.data.body);
        setData(response.data.body);
      });
  }, []);
  // console.log(data);
  const isDataEmpty = data.length === 0;

  return (
    <>
      <Accordion>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          expandIcon={<MdExpandMore size={23} />}
        >
          <Typography className="font-inter">Comentários Privados</Typography>
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
              // console.log(coment.CREATEDBY, 'email');
              // console.log(coment);
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
                  <div className="font-inter flex  justify-start">
                    <AccordionDetails>
                      <p className="font-inter">
                        Comentários:{' '}
                        <span className="text-gray200 text-semibold">
                          {comment.COMMENT}
                        </span>
                      </p>

                      <Typography className="font-inter flex justify-start">
                        Anexo(s):{'     '}
                        <p className="text-gray200 text-semibold flex gap-1 ml-2">
                          {comment?.ATTACHMENT.length > 0
                            ? comment?.ATTACHMENT.map(
                                (attachment: any, index: number) => {
                                  // console.log(attachment.ATTACHMENT);
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
                            : 'Nenhum arquivo foi anexado.'}
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
