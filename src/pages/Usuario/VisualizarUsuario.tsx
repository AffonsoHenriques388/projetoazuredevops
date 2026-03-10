import React from 'react';
import { AiFillEye } from 'react-icons/ai';
import useModal from '../../components/Modal/useModal';
import LayoutModal from '../../components/Modal/Modal';
import { Typography } from 'antd';
import { FormControl, IconButton } from '@mui/material';
import { Select, MenuItem, useMediaQuery, Theme } from '@mui/material';
import InputSecondary from '../../components/Input/InputSecondary';

export default function VisualizarUsuario({ user }: any) {
  const { toggle, open } = useModal();

  const isMobile = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('sm');
  });

  return (
    <>
      <IconButton onClick={toggle}>
        <AiFillEye size={20} className="text-blue" />
      </IconButton>
      <LayoutModal onClose={toggle} open={open}>
        <div className="bg-gray100 md:p-5 p-2 rounded md:shadow-md shadow">
          <div className="flex justify-center align-center md:p-5 p-2 gap-5 bg-white rounded md:shadow-md shadow flex-col max-w-5xl">
            <Typography.Title level={2} className="font-inter text-blue">
              Dados do Usuário
            </Typography.Title>
            <div>
              <div>
                <div>
                  <FormControl
                    size="small"
                    style={{
                      maxWidth: isMobile ? '343px' : '100%',
                      minWidth: isMobile ? '100%' : '100%',
                    }}
                  >
                    <Select
                      disabled={true}
                      value={'Administrador'}
                      id="select-role"
                      className="font-inter"
                    >
                      <MenuItem
                        value={'Administrador'}
                        key={'Administrador'}
                        className="font-inter"
                      >
                        {'Administrador'}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
                  <FormControl fullWidth>
                    <InputSecondary
                      disabled={true}
                      value={'Nome'}
                      placeholder="Nome"
                      className="inputProtocolo font-inter"
                      id="nome"
                      iconStart={undefined}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
                      disabled={true}
                      value="21 99999-9999"
                      placeholder="Telefone"
                      className="inputProtocolo font-inter"
                      maxLength={11}
                      id="telefone"
                      iconStart={undefined}
                    />
                  </FormControl>
                </div>
                <FormControl
                  size="small"
                  className="md:mt-3 mt-1"
                  style={{
                    maxWidth: isMobile ? '343px' : '100%',
                    minWidth: isMobile ? '100%' : '100%',
                  }}
                >
                  <Select
                    disabled={true}
                    value="RSM BPO"
                    id="empresa-select"
                    className="font-inter"
                  >
                    <MenuItem
                      value="RSM BPO"
                      key="RSM BPO"
                      className="font-inter"
                    >
                      {'RSM BPO'}
                    </MenuItem>
                  </Select>
                </FormControl>

                <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
                  <FormControl fullWidth>
                    <InputSecondary
                      disabled={true}
                      value="Analista de Sistemas"
                      placeholder="Cargo"
                      className="inputProtocolo font-inter"
                      id="cargo"
                      iconStart={undefined}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <InputSecondary
                      disabled={true}
                      value="TI"
                      placeholder="Departamento"
                      className="inputProtocolo font-inter"
                      id="departamento"
                      iconStart={undefined}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
                      disabled={true}
                      value="Rio de Janeiro"
                      placeholder="Unidade"
                      className="inputProtocolo font-inter"
                      id="unidade"
                      iconStart={undefined}
                    />
                  </FormControl>
                </div>
                <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
                  <FormControl fullWidth>
                    <InputSecondary
                      disabled={true}
                      value="Rio de Janeiro"
                      placeholder="Estado"
                      className="inputProtocolo font-inter"
                      id="estado"
                      iconStart={undefined}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
                      disabled={true}
                      value="Rio de Janeiro"
                      placeholder="Cidade"
                      className="inputProtocolo font-inter"
                      id="cidade"
                      iconStart={undefined}
                    />
                  </FormControl>
                </div>
                <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
                  <FormControl fullWidth>
                    <InputSecondary
                      disabled={true}
                      value={user.USERNAME}
                      placeholder="E-mail"
                      className="inputProtocolo font-inter"
                      id="e-mail"
                      iconStart={undefined}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutModal>
    </>
  );
}
