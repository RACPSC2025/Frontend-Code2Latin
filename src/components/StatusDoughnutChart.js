import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

import { STATUS } from '../config/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatusDoughnutChart({
  dataSet,
  chartOptions = {
    cutout: '80%'
  }
}) {
  const STATUS_TO_COLOR_MAPPING = {
    [STATUS.completed]: 'rgba(33,239,136, 1)',
    [STATUS.delayed]: 'rgba(240, 98, 125, 1)',
    [STATUS.pending]: 'rgba(214, 203, 111, 1)',
    [STATUS.in_progress]: 'rgba(22, 185, 172, 1)'
  };
  const { t } = useTranslation();

  const chartDataValue = dataSet.map(({ value }) => value);
  const chartDataStatusKeys = dataSet.map(({ key }) => key);
  const chartDataColors = chartDataStatusKeys.map((key) => STATUS_TO_COLOR_MAPPING[key]);

  const chartData = {
    datasets: [
      {
        //label: t('number_of_votes'),
        data: chartDataValue,
        backgroundColor: chartDataColors,
        borderColor: chartDataColors,
        borderWidth: 1
      }
    ]
  };

  
  const totalDataValue = chartDataValue.reduce((sum, value) => sum + value, 0);

  //console.log('dataSet Actions: ', dataSet);

  //return <Doughnut options={chartOptions} data={chartData} />;

  return (
    <Box>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Doughnut options={chartOptions} data={chartData} />
        <Typography color="white" variant="h5" sx={{ textAlign:'center', position: 'absolute', marginTop: '0.5rem' }}>
          {totalDataValue + ' ' + t('Actions')}
        </Typography>
      </div>
    </Box>
  );
}

export default StatusDoughnutChart;
