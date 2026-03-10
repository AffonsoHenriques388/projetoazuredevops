/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Secondary from '../../components/Secondary/Secondary';
import Header from '../../components/Header/Header';
import InputNewPass from '../../components/Input/InputNewPass';
import { FormHelperText, Typography } from '@mui/material';
import ButtonPrimary from '../../components/Button/ButtonPrimary';
import { Button } from 'antd';
import { MdCheck, MdClose } from 'react-icons/md';
import { getThemeColors } from '../../themeColors';
import { AwsConfigAuth } from '../../aws-config';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { Message } from '../../components/Message';
const poolData = {
  UserPoolId: AwsConfigAuth.userPoolId,
  ClientId: AwsConfigAuth.userPoolWebClientId,
};

const userPool = new CognitoUserPool(poolData);

export default function EsqueciMinhaSenha() {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();

  const [isEightCharacters, setIsEightCharacters] = React.useState(false);
  const [hasTwoNumbers, setHasTwoNumbers] = React.useState(false);
  const [hasSpecialCharacter, setHasSpecialCharacter] = React.useState(false);
  const [hasUppercaseLetter, setHasUppercaseLetter] = React.useState(false);
  const [message, setMessage] = React.useState<string>('');
  const [messageType, setMessageType] = React.useState<'success' | 'error'>(
    'success',
  );
  const [stage, setStage] = React.useState<number>(1);
  const [code, setCode] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handlePasswordChange = (value: string | any) => {
    setPassword(value);
    setIsEightCharacters(value.length >= 8);
    setHasTwoNumbers((value.match(/\d/g) || []).length >= 2);
    setHasSpecialCharacter(/[!@#$%^&*(),.?":{}|<>]/.test(value));
    setHasUppercaseLetter(/[A-Z]/.test(value));
  };

  const getUser = (email: string) => {
    return new CognitoUser({
      Username: email.toLowerCase(),
      Pool: userPool,
    });
  };

  const sendCode = (event: React.FormEvent) => {
    event.preventDefault();

    getUser(email).forgotPassword({
      onSuccess: (_data: any) => {
        // Lógica após sucesso
        setMessage('Código enviado com sucesso! Verfique seu e-mail.');
        setMessageType('success');
        // console.log(_data);
      },
      onFailure: (_err: any) => {
        console.log(_err);
        setMessage(
          'Erro ao enviar o código! Tente novamente ou entre em contato com o suporte.',
        );
        setMessageType('error');
        // Lógica após falha
      },
      inputVerificationCode: (_data: any) => {
        setStage(2);
        console.log(_data);
      },
    });
  };

  const resetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = getUser(email); // Passa o email como argumento

    user.confirmPassword(code, password, {
      onSuccess: (_data) => {
        // console.log(_data);
        setMessage('Sua senha foi alterada corretamente!');
        setMessageType('success');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 3500);
      },
      onFailure: (_err) => {
        setMessage('Ocorreu um erro ao alterar a senha. Tente novamente. ⚠️');
        setMessageType('error');
      },
    });
  };

  const handleInputChange = (value?: string) => {
    if (value !== undefined) {
      setEmail(value);
    }
  };

  const handleInputCode = (value?: string) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleConfirmPass = (value: string | any) => {
    setConfirmPassword(value);
  };

  return (
    <>
      <Header />
      <Secondary>
        <Typography className="font-inter text-semibold text-gray200 text-center">
          Esqueci minha senha
        </Typography>
        <div className="flex flex-col justify-center items-center">
          {message && <Message type={messageType} title={message} />}
          {stage === 1 && (
            <form onSubmit={sendCode} className="w-full">
              <label className="font-inter font-sm flex flex-col gap-2 w-full">
                E-mail:
                <InputNewPass
                  iconStart={undefined}
                  value={email}
                  $inputWidth="100%"
                  onChange={handleInputChange}
                />
              </label>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="p-2 bg-blue rounded text-white text-semibold pl-2 pr-2 w-full"
                >
                  Enviar Código de Verificação
                </button>
              </div>
            </form>
          )}
          {stage === 2 && (
            <form onSubmit={resetPassword}>
              <label className="font-inter font-sm flex flex-col gap-2">
                Digite o código que recebeu por e-mail:
                <InputNewPass
                  iconStart={undefined}
                  value={code}
                  $inputWidth="100%"
                  onChange={handleInputCode}
                />
              </label>
              <label className="font-inter font-sm flex flex-col gap-2">
                Nova Senha:
                <InputNewPass
                  iconStart={undefined}
                  value={password}
                  onChange={handlePasswordChange}
                  type="password"
                  $inputWidth="100%"
                  placeholder=" nova senha"
                />
              </label>
              <label className="font-inter font-sm flex flex-col gap-2">
                Confirme a nova Senha:
                <InputNewPass
                  iconStart={undefined}
                  value={confirmPassword}
                  $inputWidth="100%"
                  onChange={handleConfirmPass}
                  type="password"
                  placeholder="confirmar nova senha"
                />
              </label>
              <div className="flex justify-between pb-3 flex-row sm:flex-row mt-3">
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
              <div className="flex justify-center">
                <button
                  type="submit"
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
                  className={`text-white ${sixthColor} hover:${secondaryColor} ${primaryColor} ${secondaryColor} disabled:bg-gray100 disabled:text-gray disabled:border-gray100 p-2 bg-blue rounded text-white text-semibold pl-2 pr-2 w-full`}
                >
                  Alterar Senha
                </button>
              </div>
            </form>
          )}
          <a href="/admin/login" className="mt-2 text-semibold">
            Voltar para página de Login
          </a>
        </div>
      </Secondary>
    </>
  );
}
