import React from 'react';
import useModal from '../../components/Modal/useModal';
import LayoutModal from '../../components/Modal/Modal';
import { MdModeEditOutline } from 'react-icons/md';
import { Typography } from 'antd';
import axios from 'axios';
import { FormControl, IconButton, SelectChangeEvent } from '@mui/material';
import { Select, MenuItem, useMediaQuery, Theme } from '@mui/material';
import InputSecondary from '../../components/Input/InputSecondary';
import { API_URL, API_BASE } from '../../API/apiManager';

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

export default function EditarUsuario({ user }: any) {
  const { toggle, open } = useModal();
  const [role, setRole] = React.useState<string>('');
  const [companies, setCompanies] = React.useState([]);
  const [company, setCompany] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [cargo, setCargo] = React.useState<string>('');
  const [departamento, setDepartamento] = React.useState<string>('');
  const [unidade, setUnidade] = React.useState<string>('');
  const [estado, setEstado] = React.useState<string>('');
  const [cidade, setCidade] = React.useState<string>('');

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
      <IconButton onClick={toggle}>
        <MdModeEditOutline size={20} className="text-blue" />
      </IconButton>
      <LayoutModal onClose={toggle} open={open}>
        <div className="bg-gray100 md:p-5 p-2 rounded md:shadow-md shadow">
          <div className="flex justify-center align-center md:p-5 p-2 gap-5 bg-white rounded md:shadow-md shadow flex-col max-w-5xl">
            <Typography.Title level={2} className="font-inter text-blue">
              Editar Usuário
            </Typography.Title>
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
                      value={name}
                      placeholder="Nome"
                      name="nome"
                      className="inputProtocolo font-inter"
                      id="nome"
                      iconStart={undefined}
                      onChange={(value) => setName(value)}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
                      value={phone}
                      name="phone"
                      placeholder="Telefone"
                      className="inputProtocolo font-inter"
                      maxLength={11}
                      id="telefone"
                      iconStart={undefined}
                      onChange={(value) => setPhone(value)}
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
                      value={cargo}
                      name="cargo"
                      placeholder="Cargo"
                      className="inputProtocolo font-inter"
                      id="cargo"
                      iconStart={undefined}
                      onChange={(value) => setCargo(value)}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <InputSecondary
                      value={departamento}
                      name="departamento"
                      placeholder="Departamento"
                      className="inputProtocolo font-inter"
                      id="departamento"
                      iconStart={undefined}
                      onChange={(value) => setDepartamento(value)}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
                      value={unidade}
                      name="unidade"
                      placeholder="Unidade"
                      className="inputProtocolo font-inter"
                      id="unidade"
                      iconStart={undefined}
                      onChange={(value) => setUnidade(value)}
                    />
                  </FormControl>
                </div>
                <div className="flex justify-center flex-col md:flex-row gap-1 md:gap-3 md:mt-3 mt-1">
                  <FormControl fullWidth>
                    <InputSecondary
                      value={estado}
                      name="estado"
                      placeholder="Estado"
                      className="inputProtocolo font-inter"
                      id="estado"
                      iconStart={undefined}
                      onChange={(value) => setEstado(value)}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputSecondary
                      value={cidade}
                      name="cidade"
                      placeholder="Cidade"
                      className="inputProtocolo font-inter"
                      id="cidade"
                      iconStart={undefined}
                      onChange={(value) => setCidade(value)}
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
            <div className="flex justify-center gap-2 mt-3">
              <button className="p-2 bg-green text-white font-inter rounded shadow">
                Salvar alterações
              </button>
              <button
                className="p-2 bg-red text-white font-inter rounded shadow"
                onClick={toggle}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </LayoutModal>
    </>
  );
}
