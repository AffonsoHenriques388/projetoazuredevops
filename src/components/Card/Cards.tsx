import React from 'react';
import {
  CardActions,
  CardContent,
  Card,
  Theme,
  useMediaQuery,
} from '@mui/material';

interface CardsMui {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function Cards({ children, style }: CardsMui) {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  return (
    <Card
      className="shadow-md mt-2 mb-2 md:mt-0 md:mb-0 first:mt-0 last:mb-0 md:mr-2 md:ml-2 ml-0 mr-0"
      sx={{
        width: '100%',
      }}
      style={style}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
}
