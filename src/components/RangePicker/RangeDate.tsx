import React from 'react';
import locale from 'antd/locale/pt_BR';
import dayjs from 'dayjs';
import ConfigProvider from 'antd/lib/config-provider';
import 'dayjs/locale/pt-br';
import ptBR from 'antd/lib/locale/pt_BR';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { useMediaQuery, Theme } from '@mui/material';

export default function RangeDate() {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  return (
    <div className="mt-10">
      <ConfigProvider locale={ptBR}>
        <RangePicker
          allowClear={true}
          placeholder={['Data Inicial', 'Data Final']}
          format="DD/MM/YYYY"
          style={{
            height: 48,
          }}
        />
      </ConfigProvider>
    </div>
  );
}
