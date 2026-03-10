import { API_BASE } from './API/apiManager';

interface ThemeColors {
  primaryColor: string | undefined;
  secondaryColor: string | undefined;
  tertiaryColor?: string | undefined;
  fourthColor?: string | undefined;
  fifthyColor?: string | undefined;
  sixthColor?: string | undefined;
}

export function getThemeColors(): ThemeColors {
  let primaryColor;
  let secondaryColor;
  let tertiaryColor;
  let fourthColor;
  let fifthyColor;
  let sixthColor;

  switch (API_BASE) {
    case 'estrela':
      primaryColor = 'bg-blue500'; //azul escuro p tudo que for azul clarinho! vai ser bg-blue
      secondaryColor = 'bg-orange';
      tertiaryColor = 'text-orange'; //titulos em azul claro e verde
      fourthColor = 'text-blue500'; // textos em azul claro p azul escuro titulos grandes das paginas --- vai ser text-blue
      fifthyColor = 'bg-orange';
      sixthColor = 'border-orange'; //  bordas azuis
      break;
    case 'sbaraini':
      primaryColor = 'bg-blue';
      secondaryColor = 'text-white';
      tertiaryColor = 'text-blue';
      fourthColor = 'text-blue500';
      fifthyColor = 'bg-yellow';
      sixthColor = 'border-blue';

      break;
    case 'localhost':
      primaryColor = 'bg-blue';
      secondaryColor = 'text-white';
      tertiaryColor = 'text-blue';
      fourthColor = 'text-blue500';
      fifthyColor = 'bg-yellow';
      sixthColor = 'border-blue';
      break;
    default:
      primaryColor = 'bg-blue';
      secondaryColor = 'text-white';
      tertiaryColor = 'text-blue';
      fourthColor = 'text-blue500';
      fifthyColor = 'bg-yellow';
      sixthColor = 'border-blue';
  }

  return {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  };
}
