import React from 'react';
import useModal from '../../components/Modal/useModal';
import LayoutModal from '../../components/Modal/Modal';
import { IconButton } from '@mui/material';
import { MdDelete } from 'react-icons/md';
import { Typography } from 'antd';

export default function DeletarUsuario({ user }: any) {
  const { toggle, open } = useModal();

  return (
    <>
      <IconButton onClick={toggle}>
        <MdDelete size={20} className="text-blue" />
      </IconButton>
      <LayoutModal onClose={toggle} open={open}>
        <Typography.Title level={3} className="font-inter text-blue">
          Confirmação de exclusão de usuário
        </Typography.Title>
        <Typography.Text className="font-inter text-gray200">
          Tem certeza que deseja excluir o usuário{' '}
          <strong className="text-red">{user.USERNAME}</strong>?
        </Typography.Text>
        <div className="flex justify-center gap-2 mt-3">
          <button className="p-2 bg-green text-white font-inter rounded shadow">
            Sim, excluir!
          </button>
          <button
            className="p-2 bg-red text-white font-inter rounded shadow"
            onClick={toggle}
          >
            Cancelar
          </button>
        </div>
      </LayoutModal>
    </>
  );
}
