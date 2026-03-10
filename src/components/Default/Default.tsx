import React from 'react';
import MenuBar from '../MenuBar/MenuBar';
import { Box } from '@mui/material';

export default function Default({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <MenuBar>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 0.5 }}
          className="max-h-screen overflow-y-auto"
        >
          <div className="bg-white p-5 mb-10 rounded-xl">{children}</div>
        </Box>
      </MenuBar>
    </Box>
  );
}
