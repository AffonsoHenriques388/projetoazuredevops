/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Typography } from 'antd/lib';
import { Button, FormHelperText, Chip } from '@mui/material';
import InputPrimary from '../../components/Input/InputPrimary';
import { useReactToPrint } from 'react-to-print';
import { getThemeColors } from '../../themeColors';
import ButtonSecondary from '../../components/Button/ButtonSecondary';
import { API_BASE } from '../../API/apiManager';

export default function ProtocolNumber({ protocol, confirmPassword }: any) {
  const componentRef = React.useRef(null);
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // console.log(protocol);
  // console.log(confirmPassword);

  const goToHome = () => {
    window.location.href = '/';
  };

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
    <React.Fragment>
      <div>
        <div ref={componentRef} className="print:p-20">
          <Typography.Title level={5} className={`${tertiaryColor}text-center`}>
            Caro(a) denunciante, obrigado pela sua iniciativa. Recebemos a sua
            denúncia e, em breve, inciaremos o processo de triagem e tratamentos
            dos elementos da denúncia.
          </Typography.Title>
          <div className="flex justify-center flex-col text-center mt-3 mb-3 ">
            <div className="flex justify-center flex-col">
              <Typography.Title level={4} className="text-gray200 m-0 mb-3">
                O número de protocolo da sua denúncia é:{'  '}
              </Typography.Title>
              <Typography.Title level={3} className="text-green m-0">
                <Chip label={protocol} color="success" className="text-xl" />
              </Typography.Title>
            </div>

            <div className="flex justify-center flex-col mt-3 mb-3">
              <Typography.Title level={4} className="text-gray200 mb-3">
                A senha cadastrada para acompanhar a denúncia é:{'  '}
              </Typography.Title>
              <InputPrimary
                iconStart={undefined}
                required={false}
                value={confirmPassword}
                type="password"
              />
            </div>
          </div>
          <FormHelperText className="text-center font-bold">
            Recomendamos que imprima ou anote a senha e o número de protocolo.
            Visto que, por segurança e para manter o anonimato, esses dados não
            poderão ser recuperados.
          </FormHelperText>
          <div className="flex justify-center flex-col md:flex-row gap-2 md:gap-3 md:mt-3 mt-2">
            <ButtonSecondary
              className="font-inter"
              onClick={handlePrint}
              bgColor={colorSecondaryButton}
              hoverColor={hoverSecondaryButton}
            >
              Imprimir
            </ButtonSecondary>
            <ButtonSecondary
              className="font-inter"
              onClick={goToHome}
              bgColor={colorSecondaryButton}
              hoverColor={hoverSecondaryButton}
            >
              Finalizar
            </ButtonSecondary>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
