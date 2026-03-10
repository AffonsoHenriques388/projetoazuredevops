import * as React from 'react';
import { Box, Button, Typography, Modal, IconButton } from '@mui/material';
import { IoMdClose } from 'react-icons/io';

export interface ModalProps {
  children: React.ReactNode | React.ReactNodeArray;
  open: boolean;
  onClose?: () => void;
  color?: string;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 850,
  maxHeight: '100%',
  bgcolor: 'background.paper',
  borderRadius: 2,
  p: 4,
  zIndex: 1000,
  overflow: 'auto',
};
export default function ModalRefactor({
  onClose = () => {},
  children,
  open,
}: ModalProps) {
  return (
    <>
      {open && (
        <Modal open onClose={onClose}>
          <Box sx={style}>
            {/* <div className="flex justify-end">
              <IconButton onClick={onClose}>
                <IoMdClose />
              </IconButton>
            </div> */}
            <div className={`flex justify-center flex-col text-center mt-2`}>
              {children}
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
}
