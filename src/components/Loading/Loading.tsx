import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getThemeColors } from '../../themeColors';

interface LoadingProps {
  size?: number;
}

export default function Loading({ size }: LoadingProps) {
  const { fourthColor } = getThemeColors();
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress
        size={size}
        // style={{ color: '#009CDE' }}
        className={`${fourthColor}`}
      />
    </Box>
  );
}
