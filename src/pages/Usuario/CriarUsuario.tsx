import useModal from '../../components/Modal/useModal';
import LayoutModal from '../../components/Modal/Modal';
import ButtonSecondary from '../../components/Button/ButtonSecondary';
import { Typography } from 'antd';
import axios from 'axios';
import { API_BASE, API_URL } from '../../API/apiManager';
import React from 'react';
import {
  FormControl,
  FormHelperText,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import { Select, MenuItem, useMediaQuery, Theme } from '@mui/material';
import InputSecondary from '../../components/Input/InputSecondary';
import Secondary from '../../components/Secondary/Secondary';

const RoleType = [
  {
    id: 1,
    name: 'Selecione uma opção',
  },
  {
    id: 2,
    name: 'Administrador',
  },
  {
    id: 3,
    name: 'Comitê de Ética',
  },
  {
    id: 4,
    name: 'Compliance',
  },
  {
    id: 5,
    name: 'Apenas Leitura',
  },
];

export default function CriarUsuario() {
  const { open, toggle } = useModal();
  const [role, setRole] = React.useState<string>('');
  const [companies, setCompanies] = React.useState([]);
  const [company, setCompany] = React.useState<string>('');
  const isMobile = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('sm');
  });

  const handleSelectRole = (e: SelectChangeEvent<string>) => {
    const newValue = e.target.value;
    setRole(newValue);
  };

  const handleChangeCompany = (e: SelectChangeEvent<string>) => {
    const newValue = e.target.value;
    setCompany(newValue);
  };

  React.useEffect(() => {
    axios
      .get(API_URL + '/companies', {
        headers: {
          Base: API_BASE,
        },
      })
      .then((response) => {
        setCompanies(response.data);
      });
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <ButtonSecondary onClick={toggle} type="button">
          Criar novo usuário
        </ButtonSecondary>
      </div>
      <LayoutModal onClose={toggle} open={open}>
        <form>
          <Secondary>
            <div className="flex justify-center">
              <Typography.Title
                level={2}
                className="font-inter text-blue md:mt-3 mt-0"
              >
                Criar novo usuário
              </Typography.Title>
            </div>
            <div>
              <div>
                <div>
                  <Typography.Text className="font-inter text-gray200">
                    Selecione um perfil de usuário
                  </Typography.Text>
                  <FormControl
                    size="small"
                    style={{
                      maxWidth: isMobile ? '343px' : '100%',
                      minWidth: isMobile ? '100%' : '100%',
                    }}
                  >
                    <Select
                      onChange={handleSelectRole}
                      value={role}
                      id="select-role"
                      className="font-inter"
                    >
                      {RoleType.map((role: any) => (
                        <MenuItem
                          value={role.name}
                          key={role.id}
                          className="font-inter"
                        >
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
                  <FormControl fullWidth>
                    <InputSecondary
                      placeholder="Nome"
                      className="inputProtocolo font-inter"
                      id="nome"
                      iconStart={undefined}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
                      placeholder="Telefone"
                      className="inputProtocolo font-inter"
                      maxLength={11}
                      id="telefone"
                      iconStart={undefined}
                    />
                  </FormControl>
                </div>

                <div className=" mt-1">
                  <Typography.Text className="font-inter text-gray200">
                    Selecione uma empresa
                  </Typography.Text>
                </div>
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
                      className="font-inter"
                    >
                      {companies.map((company: any) => (
                        <MenuItem
                          value={company.IDCOMPANY}
                          key={company.IDCOMPANY}
                          className="font-inter"
                        >
                          {`${company.CNPJ.replace(/\D/g, '').replace(
                            /^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/,
                            '$1.$2.$3/$4-$5',
                          )} - ${company.RAZAOSOCIAL}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null}
                <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
                  <FormControl fullWidth>
                    <InputSecondary
                      placeholder="Cargo"
                      className="inputProtocolo font-inter"
                      id="cargo"
                      iconStart={undefined}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <InputSecondary
                      placeholder="Departamento"
                      className="inputProtocolo font-inter"
                      id="departamento"
                      iconStart={undefined}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
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
                      placeholder="Estado"
                      className="inputProtocolo font-inter"
                      id="estado"
                      iconStart={undefined}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
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
                      placeholder="E-mail"
                      className="inputProtocolo font-inter"
                      id="e-mail"
                      iconStart={undefined}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
                      placeholder="Login"
                      className="inputProtocolo font-inter"
                      id="login"
                      iconStart={undefined}
                    />
                  </FormControl>
                </div>
                <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
                  <FormControl fullWidth>
                    <InputSecondary
                      placeholder="Senha"
                      className="inputProtocolo"
                      id="senha"
                      type="password"
                      iconStart={undefined}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
                      placeholder="Confirmar Senha"
                      className="inputProtocolo"
                      id="confirmar-senha"
                      type="password"
                      iconStart={undefined}
                    />
                  </FormControl>
                </div>
                <div className="flex justify-center flex-col md:flex-row gap-2 md:gap-3 md:mt-3 mt-2">
                  <Button
                    variant="contained"
                    color="success"
                    className="font-inter"
                  >
                    Criar Usuário
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    className="font-inter"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </Secondary>
        </form>
      </LayoutModal>
    </>
  );
}
