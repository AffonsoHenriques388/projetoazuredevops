/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement } from 'react';
import Highcharts from 'highcharts/highcharts.js';
import HighchartsReact from 'highcharts-react-official';
import { API_BASE } from '../../../API/apiManager';

type PropTypes = {
  variant?: 'default' | 'twoColors';
  title?: string;
  subtitle?: string;
  height?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  series: Array<{
    name: string;
    colorByPoint: boolean;
    data: Array<{
      name: string;
      y: number;
    }>;
  }>;
};

const colorsBase = (() => {
  switch (API_BASE) {
    case 'localhost':
      return ['#009CDD', '#4AB63E', '#888B8D', '#00518B'];
    case 'estrela':
      return ['#114568', '#F4A231', '#888B8D', '#FEDB31'];
    case 'sbaraini':
      return ['#009CDD', '#4AB63E', '#888B8D', '#00518B'];
    default:
      return ['#009CDD', '#4AB63E', '#888B8D', '#00518B'];
  }
})();
const variantsConfig = {
  default: {
    colors: colorsBase,
  },
};
const DonutChart = ({
  variant = 'default',
  height = 'max-content',
  title = '',
  subtitle = '',
  valuePrefix = '',
  valueSuffix = '',
  series,
}: PropTypes): ReactElement => {
  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: height,
    },
    title: {
      text: title,
      style: {
        fontSize: '18px',
        fontFamily: 'inter',
        fontWeight: 600,
        color: '#FFF',
      },
    },
    subtitle: {
      text: subtitle,
      style: {
        fontSize: '14px',
        fontFamily: 'inter',
        fontWeight: 500,
        color: '#FFF',
      },
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
      point: {
        valueSuffix: valueSuffix,
      },
    },
    plotOptions: {
      pie: {
        shadow: false,
        center: ['50%', '50%'],
        borderWidth: 4,
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          padding: 0,
          color: '#000',
          distance: 15,
          format: '{point.percentage:.0f}%',
          style: {
            fontSize: '13px',
            fontWeight: '400',
            fontFamily: 'inter',
            color: '#FFF',
            textOutline: 0,
          },
        },
        innerSize: '60%',
      },
      series: {
        animation: false,
      },
    },
    tooltip: {
      backgroundColor: '#BCBCBC',
      borderColor: '#757575',
      borderRadius: 5,
      borderWidth: 1,
      shared: true,
      backdropFilter: true,
      backdropOpacity: 12,
      crosshairs: true,
      valuePrefix: valuePrefix,
      valueSuffix: valueSuffix,
      xDateFormat: '%d/%m/%Y - %H:%M',
      valueDecimals: 2,
      useHTML: true,
      headerFormat: `
        <h1 style="font-size: 12px; color: #000; text-align: center; font-family: inter; padding-bottom: 15px; font-weight: bold">
          {point.key}
        </h1>
        <div style="display: grid; grid-template-columns: 1fr 1fr; grid-column-gap: 50px; grid-row-gap: .2em; font-family: inter;">`,
      pointFormat: `
        <div style="width: 100%; display: flex; justify-content: space-between; font-family: inter;">
          <span style="color: #000; font-weight: 700; border-left: 5px solid {series.color}; padding: 0 7px; font-size: 12px;">
            {series.name}:
          </span>
          <span style="color: #000; font-size: 12px;">
            {point.y} 
          </span>
        </div>`,
      footerFormat: '</div>',
    },
    series: series,
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 768,
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
            },
            yAxis: {
              labels: {
                align: 'left',
                x: 0,
                y: -5,
              },
              title: {
                text: null,
              },
            },
          },
        },
      ],
    },
    credits: {
      enabled: false,
    },
    legend: {
      itemMarginTop: 3,
      itemMarginBottom: 3,
      itemStyle: { color: '#5D5D5D' },
      itemHoverStyle: { color: '#000' },
      itemHiddenStyle: { color: '#993366' },
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'bottom',
    },
    colors: variantsConfig[variant as keyof typeof variantsConfig].colors,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default DonutChart;
