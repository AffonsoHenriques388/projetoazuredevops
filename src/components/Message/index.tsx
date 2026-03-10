import { Typography } from '@mui/material';
import { BiError } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa6';
import { Alert } from '@mui/material';
type MessageTypes = {
  type: 'success' | 'error';
  title: string;
};

const Message = ({ type = 'success', title = '' }: MessageTypes) => {
  return (
    <div className="mb-2 mt-2">
      {type === 'error' && (
        <Alert severity="error">
          <Typography className="text-xs font-inter font-bold text-red">
            {title}
          </Typography>
        </Alert>
      )}
      {type === 'success' && (
        <Alert>
          <Typography className="text-xs font-inter font-bold text-green">
            {title}
          </Typography>
        </Alert>
      )}
    </div>
  );
};

export { Message };
