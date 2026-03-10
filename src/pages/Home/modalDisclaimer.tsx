/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import LayoutModal from '../../components/Modal/Modal';
import useModal from '../../components/Modal/useModal';
import CadeadoIMG from '../../assets/registro-seguro-icon.png';
import GloboIMG from '../../assets/seguranca-de-dados-icon.png';
import TimerIMG from '../../assets/simples-e-rapido-icon.png';
import ModalRefactor from '../../components/Modal/ModalRefactor';
import { getThemeColors } from '../../themeColors';
import { API_BASE } from '../../API/apiManager';

export default function ModalDisclaimer() {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const { toggle, open } = useModal();

  React.useEffect(() => {
    toggle();
  }, []);

  // console.log(import.meta.env.VITE_KEY);

  // const handleEnviroment = (enviroment: string) => {
  //   const image = document.getElementById('image');
  //   console.log(image);
  //   if (enviroment === 'localhost' && image instanceof HTMLElement) {
  //     image.style.filter =
  //       'filter: brightness(0) saturate(100%) invert(20%) sepia(75%) saturate(780%) hue-rotate(167deg) brightness(91%) contrast(93%);';
  //   }
  // };

  // handleEnviroment(API_BASE);

  return (
    <ModalRefactor open={open}>
      <div className="flex justify-center flex-col">
        <div className="flex justify-left">
          <img src={CadeadoIMG} className="imgDisclaimer" id="image" />
          <div className="flex justify-center flex-col">
            <p className="text-gray200 font-roboto font-semibold md:text-3xl text-xl ml-5 text-left">
              É seguro registrar denúncias aqui.
            </p>
            <span className="text-gray200 font-roboto md:text-base text-sm break-keep ml-5 text-left">
              Este é um sistema concebido e administrado de forma independente
              para assegurar a segurança e garantir a manutenção do seu
              anonimato, se assim você preferir.
            </span>
          </div>
        </div>
        <div className="flex justify-left my-16">
          <img src={GloboIMG} className="imgDisclaimer" />
          <div className="flex justify-center flex-col">
            <p className="text-gray200 font-roboto font-semibold md:text-3xl text-xl  ml-5 text-left">
              Os dados registrados são preservados.
            </p>
            <span className="text-gray200 font-roboto md:text-base text-sm break-keep ml-5 text-left">
              Após o registro, todo o conteúdo da sua denúncia será mantido de
              forma íntegra, assegurando que 100% dos dados inseridos não possam
              ser manipulados
            </span>
          </div>
        </div>
        <div className="flex justify-left mb-10">
          <img src={TimerIMG} className="imgDisclaimer" />
          <div className="flex justify-center flex-col">
            <p className="text-gray200 font-roboto font-semibold md:text-3xl text-xl ml-5 text-left">
              É simples e rápido.
            </p>
            <span className="text-gray200 font-roboto md:text-base text-sm break-keep ml-5 text-left">
              Realize o registro respondendo a um questionário simples e
              objetivo. Ao final, você poderá cadastrar uma senha para
              acompanhar a evolução da denúncia.
            </span>
          </div>
        </div>
        <button
          className={`font-inter py-2 md:py-3 px-2 md:px-4 border-none rounded gap-3 text-semibold text-lg ${primaryColor} text-white`}
          onClick={toggle}
        >
          De acordo
        </button>
      </div>
    </ModalRefactor>
  );
}
