
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { Box, fontSize } from '@mui/system';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  setFilter
} from '../stores/filterSlice';

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

const useListOptionsGlobal = (fieldName) =>
  useSelector((state) => state.globalData?.[fieldName] ?? []);

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));

const centerTextPlugin = {
  id: 'centerTextPlugin',
  afterDraw: (chart) => {
    if (!chart.chart) {
      return;
    }
    let width = chart.chart.width,
      height = chart.chart.height,
      ctx = chart.chart.ctx;

    ctx.restore();
    //let fontSize = (height / 114).toFixed(2);
    let fontSize = 1.2;
    ctx.font = fontSize + 'em sans-serif';
    ctx.textBaseline = 'middle';

    let text = 'Center Text',
      textX = Math.round((width - ctx.measureText(text).width) / 2),
      textY = height / 2;

    ctx.fillText(text, textX, textY);
    //ctx.save();
  }
};

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(centerTextPlugin);

function RequirementsArticlesDoughnutChart({
  dataSetTasks,
  dataSetCycles,
  chartOptions = {
    cutout: '70%',
    responsive: true,
    tooltipItems: false,
    plugins: {
      legend: {
        display: false
      },
      centerTextPlugin: {
        display: true,
        text: 'Articles & Requirements',
        color: 'black',
        fontStyle: 'bold',
        font: 'Arial',
        //minFontSize: 12,
        //maxFontSize: 20
        fontSize: '1.2rem',
        minFontSize: '1.2rem',
        maxFontSize: '1.2rem',
      }
    }
  }
}) {
  const { t } = useTranslation();
  const listLegalStatus = useFilterItemValue('legalMatrix', 'legal_list_status');

  
  const chartData = {
    labels: [t('open'), t('InProgress'), t('closed'), t('Delayed')],

    datasets: [
      {
        label: t('Articles'),
        data: [
          dataSetTasks.openTasks,
          dataSetTasks.inProgressTasks,
          dataSetTasks.closedTasks,
          dataSetTasks.delayedTasks
        ],
        backgroundColor: [
          'rgba(22, 185, 172, 1)',
          'rgba(214, 203, 111, 1)',
          'rgba(33,239,136, 1)',
          'rgba(240, 98, 125, 1)'
        ],
        borderWidth: 0
      },
      {
        backgroundColor: ['rgba(0, 0, 0, 0)'],
        hoverBackgroundColor: ['rgba(0, 0, 0, 0)'],
        borderWidth: 0
      },
      {
        label: t('requirements'),
        data: [
          dataSetTasks.openCycles,
          dataSetTasks.inProgressCycles,
          dataSetTasks.completedCycles,
          dataSetTasks.delayedCycles
        ],
        backgroundColor: [
          'rgba(22, 185, 172, 1)',
          'rgba(214, 203, 111, 1)',
          'rgba(33,239,136, 1)',
          'rgba(240, 98, 125, 1)'
        ],
        borderWidth: 0
      }
    ]
  };

  /*
  const mapStatusToKey = (statusValue, suffix = 'Tasks') => {
    switch (statusValue) {
      case 'pending':
        return `open${suffix}`;
      case 'completed':
        return `closed${suffix}`;
      case 'delayed':
        return `delayed${suffix}`;
      case 'permanent':
        return `inProgress${suffix}`;
      default:
        return `unknown${suffix}`;
    }
  };

  const chartData = {
    labels: listLegalStatus.map((status) => t(status.label)),
    datasets: [
      {
        label: t('Articles'),
        data: listLegalStatus.map((status) => {
          const key = mapStatusToKey(status.value); // ← función auxiliar
          return dataSetTasks[key] ?? 0;
        }),
        backgroundColor: listLegalStatus.map((status) => status.color_code),
        borderWidth: 0
      },
      {
        backgroundColor: ['rgba(0, 0, 0, 0)'],
        hoverBackgroundColor: ['rgba(0, 0, 0, 0)'],
        borderWidth: 0
      },
      {
        label: t('requirements'),
        data: listLegalStatus.map((status) => {
          const key = mapStatusToKey(status.value, 'Cycles');
          return dataSetTasks[key] ?? 0;
        }),
        backgroundColor: listLegalStatus.map((status) => status.color_code),
        borderWidth: 0
      }
    ]
  };
  */
  
  /*
  const legalStatusMap = {
    pending: {
      articlesKey: 'open_articles',
      requirementsKey: 'open_requirements',
    },
    permanent: {
      articlesKey: 'inprogress_articles',
      requirementsKey: 'inprogress_requirements',
    },
    completed: {
      articlesKey: 'completed_articles',
      requirementsKey: 'completed_requirements',
    },
    delayed: {
      articlesKey: 'delayed_articles',
      requirementsKey: 'delayed_requirements',
    },
  };
  */
  
  /*
  const legalStatusMap = {
    pending: {
      articlesKey: 'inProgressCycles',
      requirementsKey: 'inProgressTasks',
    },
    permanent: {
      articlesKey: 'inprogress_articles',
      requirementsKey: 'inprogress_requirements',
    },
    completed: {
      articlesKey: 'completedCycles',
      requirementsKey: 'completedTasks',
    },
    delayed: {
      articlesKey: 'delayedCycles',
      requirementsKey: 'delayedTasks',
    },
  };
*/
/*
  const useChartData = (listLegalStatus, dataSetTasks, t) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
      if (!listLegalStatus || !dataSetTasks) return;

      const labels = [];
      const articleData = [];
      const requirementData = [];
      const backgroundColors = [];
      */

      /*
      listLegalStatus.forEach((status) => {
        if (!status.label || !legalStatusMap[status.value]) return;

        const { articlesKey, requirementsKey } = legalStatusMap[status.value];

        labels.push(t(status.label));
        articleData.push(Number(dataSetTasks[articlesKey] || 0));
        requirementData.push(Number(dataSetTasks[requirementsKey] || 0));
        backgroundColors.push(status.color_code);
      });
      */
      
/*
      articleData.push( 
        Number(dataSetTasks.openCycles || 0),
        Number(dataSetTasks.inProgressCycles || 0),
        Number(dataSetTasks.completedCycles || 0),
        Number(dataSetTasks.delayedCycles || 0)
      );

      requirementData.push(
        Number(dataSetTasks.openTasks || 0),
        Number(dataSetTasks.inProgressTasks || 0),
        Number(dataSetTasks.completedTasks || 0),
        Number(dataSetTasks.delayedTasks || 0)
      );

      labels.push(
        t('open'),
        t('InProgress'),
        t('closed'),
        t('Delayed')
      );

      backgroundColors.push(
        'rgba(22, 185, 172, 1)',
        'rgba(214, 203, 111, 1)',
        'rgba(33,239,136, 1)',
        'rgba(240, 98, 125, 1)'
     );

     
      console.log('articleData: ', articleData);
      console.log('requirementData: ', requirementData);

      setChartData({
        labels,
        datasets: [
          {
            label: t('Articles'),
            data: articleData,
            backgroundColor: backgroundColors,
            borderWidth: 0,
          },
          {
            backgroundColor: ['rgba(0, 0, 0, 0)'],
            hoverBackgroundColor: ['rgba(0, 0, 0, 0)'],
            borderWidth: 0,
          },
          {
            label: t('requirements'),
            data: requirementData,
            backgroundColor: backgroundColors,
            borderWidth: 0,
          },
        ],
      });
    }, [listLegalStatus, dataSetTasks, t]);

    return chartData;
  };
  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  */

  useEffect(() => {
    if (listLegalStatus && listLegalStatus.length > 0) {
      console.log('listLegalStatus GET: ', listLegalStatus);
      console.log('dataSetLegals GET: ', dataSetTasks);
    }
  }, [listLegalStatus]);

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
        
        {chartData ? (
          <Doughnut options={chartOptions} data={chartData} style={{ zIndex: '1000' }} />
        ) : (
          <div>{t('Loading chart...')}</div>
        )}
        <Typography color="white" fontSize={'1.2rem'} variant="h6" style={{ textAlign:'center', position: 'absolute', marginTop: '-1.5rem', fontSize: '1.1rem', maxFontSize: '1.1rem', minFontSize: '1.1rem' }}>
          {t('requirements')} <br />
          {dataSetTasks.numberOfTasks}
        </Typography>
        <Typography color="white" variant="h5" style={{ position: 'absolute', paddingTop: '3rem', fontSize: '1.1rem', maxFontSize: '1.1rem', minFontSize: '1.1rem' }}>
          {dataSetTasks.numberOfCycles + ' '+ t('articles')}
        </Typography>
      </div>
    </Box>
  );
}

export default RequirementsArticlesDoughnutChart;
