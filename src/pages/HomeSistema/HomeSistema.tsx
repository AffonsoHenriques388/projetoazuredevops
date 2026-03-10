/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Default from '../../components/Default/Default';
import Box from '@mui/material/Box';
import { List } from '@mui/material';
import { useMediaQuery, Theme, Typography, ListItem } from '@mui/material';
import { Row, Col } from 'antd';
import PieChart from '../../components/Charts/Charts/PieChart';
import StackedColumn from '../../components/Charts/Charts/StackedColumn';
import Cards from '../../components/Card/Cards';
// import RangeDate from '../../components/RangePicker/RangeDate';
import BarChart from '../../components/Charts/Charts/BarChart';
import DonutChart from '../../components/Charts/Charts/DonutChart';
import ConfigProvider from 'antd/lib/config-provider';
import 'dayjs/locale/pt-br';
import ptBR from 'antd/lib/locale/pt_BR';
import { DatePicker } from 'antd';
import { API_BASE, API_URL } from '../../API/apiManager';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { RangeValue } from 'rc-picker/lib/interface';
const { RangePicker } = DatePicker;
import { getThemeColors } from '../../themeColors';

interface DataDashboard {
  MOST_COMPLAINTTYPE?: string | any;
  TOTAL_COMPLAINTS?: number | any;
  TOP5_COMPLAINTTYPES?: Array<any>;
  TOTAL_COMPLAINTS_BY_STATUS?: Array<any>;
  TOTAL_COMPLAINTS_BY_TYPE?: Array<any>;
  TOTAL_OF_ANONYMOUS_NON_ANONYMOUS?: {
    ANONYMOUSCOMPLIANTS: number | string | any;
    NONANONYMOUSCOMPLIANTS: number | string | any;
  };
  TOTAL?: number | any;
}

const HomeSistema = () => {
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fourthColor,
    fifthyColor,
    sixthColor,
  } = getThemeColors();
  const [dateFrom, setDateFrom] = React.useState<string>(
    dayjs().startOf('year').format('DD-MM-YYYY'),
  );
  const [dateTo, setDateTo] = React.useState<string>(
    dayjs().format('DD-MM-YYYY'),
  );

  const [dataDashboard, setDataDashboard] = React.useState({} as DataDashboard);

  React.useEffect(() => {
    // Chama a função de busca de dados ao montar o componente
    getDashboardData();
  }, [dateFrom, dateTo]); // Executa apenas ao montar o componente

  const handleDatePicker = (
    _dates: RangeValue<Dayjs>,
    dateStrings: [string, string],
  ) => {
    setDateFrom(dateStrings[0]);
    setDateTo(dateStrings[1]);
    // console.log(dateStrings);
    getDashboardData();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getDashboardData() {
    try {
      const options = {
        dateFrom: dateFrom,
        dateTo: dateTo,
        Base: API_BASE,
        Accept: 'application/json',
      };
      // console.log(options);
      const response = await axios.get(API_URL + '/dashboard', {
        headers: options,
      });
      const responseData = response.data.body;
      // console.log(responseData);
      setDataDashboard(responseData);
    } catch (error) {
      console.log(error);
    }
  }
  // console.log(dateFrom, 'inicio');

  // console.log(dateTo, 'fim');

  //piechart
  const mocktwo = {
    series: [
      {
        name: 'Denúncias',
        colorByPoint: true,
        data:
          dataDashboard?.TOTAL_COMPLAINTS_BY_TYPE?.map((item: any) => ({
            name: item.IDCOMPLAINTTYPE,
            y: item.TOTAL,
          })) || [],
      },
    ],
  };

  // { name: 'Agressão', y: 5 },
  // { name: 'Desvio de Comportamento', y: 2 },
  // { name: 'Conflito de Interesses', y: 1 },

  //mock tree p stqcked column
  const mockthree = {
    categories: dataDashboard?.TOP5_COMPLAINTTYPES?.map((item: any) => [
      item.IDCOMPLAINTTYPE,
    ]),
    series: [
      {
        name: 'Quantidade de Denúncias por tipo',
        data: dataDashboard?.TOP5_COMPLAINTTYPES?.map((item: any) => [
          item.TOTAL,
        ]),
      },
    ],
  };

  const mockone = {
    categories: dataDashboard?.TOTAL_COMPLAINTS_BY_STATUS?.map((item: any) => [
      item.STATUS,
    ]),
    series: [
      {
        name: 'Quantidade de Denúncias por tipo',
        data: dataDashboard?.TOTAL_COMPLAINTS_BY_STATUS?.map((item: any) => [
          item.TOTAL,
        ]),
      },
    ],
  };

  // console.log(dataDashboard?.TOTAL_COMPLAINTS_BY_STATUS);

  //donutchart
  const mockfour = {
    series: [
      {
        name: 'Total de Denúncias anônimas e não anônimas',
        colorByPoint: true,
        data: [
          {
            name: 'Anônimas',
            y: dataDashboard?.TOTAL_OF_ANONYMOUS_NON_ANONYMOUS
              ?.ANONYMOUSCOMPLIANTS,
          },
          {
            name: 'Não Anônimas',
            y: dataDashboard?.TOTAL_OF_ANONYMOUS_NON_ANONYMOUS
              ?.NONANONYMOUSCOMPLIANTS,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Default>
        <Box style={{ width: '100%' }}>
          <Row className="p-2 md:p3">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className="flex flex-col md:flex-row justify-between"
            >
              <Cards
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #BFBFBF',
                }}
              >
                <Typography className="font-inter text-center">
                  Selecione uma data e verifique
                </Typography>
                <Typography className="font-inter text-center">
                  as denúncias por períodos
                </Typography>
                <div className="mt-10">
                  <ConfigProvider locale={ptBR}>
                    <RangePicker
                      allowClear={true}
                      placeholder={['Data Inicial', 'Data Final']}
                      format="DD/MM/YYYY"
                      onChange={handleDatePicker}
                      style={{
                        height: 48,
                        width: '100%',
                      }}
                    />
                  </ConfigProvider>
                </div>
              </Cards>

              <Cards
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #BFBFBF',
                }}
              >
                <Typography gutterBottom variant="h6" className="font-inter">
                  Total de Denúncias:
                </Typography>
                <Typography
                  gutterBottom
                  variant="h2"
                  className={`font-inter text-center ${tertiaryColor} mt-4 md:mt-7`}
                >
                  {dataDashboard.TOTAL_COMPLAINTS}
                </Typography>
              </Cards>

              <Cards
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #BFBFBF',
                }}
              >
                <Typography gutterBottom variant="h6" className="font-inter">
                  Natureza mais Denunciada:
                </Typography>
                <Typography
                  gutterBottom
                  variant="h4"
                  className={`font-inter text-center ${tertiaryColor} mt-4 md:mt-9`}
                >
                  {dataDashboard.MOST_COMPLAINTTYPE}
                </Typography>
              </Cards>
            </Col>
          </Row>
          <Row className="flex justify-between mt-3 md:mt-0 gap-5 md:gap-0">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} className="p-2 md:p-3">
              <div className="bg-white p-2 md:p-5 rounded shadow border border-gray">
                <Typography className="font-inter text-center">
                  Top 5 Denúncias por Natureza
                </Typography>
                <StackedColumn
                  series={mockthree.series}
                  categories={mockthree.categories}
                />
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} className="p-2 md:p-3">
              <div className="bg-white p-2 md:p-5 rounded shadow border border-gray">
                <Typography className="font-inter text-center">
                  Forma de Denúncia(Anômina/ Não Anônima)
                </Typography>

                <DonutChart series={mockfour.series} />
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              className=" p-2 md:p-3 mt-0 md:mt-3"
            >
              <div className="bg-white p-2 md:p-5 rounded shadow border border-gray">
                <Typography className="font-inter text-center">
                  Quantidade de Denúncias por Tipo
                </Typography>
                <PieChart series={mocktwo.series} />
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              className=" p-2 md:p-3 mt-0 md:mt-3"
            >
              <div className="bg-white p-2 md:p-5 rounded shadow border border-gray">
                <Typography className="font-inter text-center">
                  Quantidade de Denúncias em Aberto
                </Typography>
                <BarChart
                  series={mockone.series}
                  categories={mockone.categories}
                />
              </div>
            </Col>
          </Row>
        </Box>
      </Default>
    </>
  );
};

export default HomeSistema;
