import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarControllerChartOptions,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  ScaleChartOptions,
  ChartData,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { Bar } from 'react-chartjs-2';
import useTheme from '@mui/system/useTheme';
import { useState, useEffect } from 'react';
import parsedGet from 'utils/api/parsed-get';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

type ChartDataResult = {
  labels: string[];
  active: number[];
  inactive: number[];
  total: number[];
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options: _DeepPartialObject<
  CoreChartOptions<'bar'> &
    ElementChartOptions<'bar'> &
    PluginChartOptions<'bar'> &
    DatasetChartOptions<'bar'> &
    ScaleChartOptions<'bar'> &
    BarControllerChartOptions
> = {
  plugins: {
    title: {
      display: true,
      text: 'Membership Status by Join Year',
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

//options.indexAxis = 'y';

const MembershipChart = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<ChartData<'bar', number[], unknown>>(null);

  const getData = async () => {
    const results = await parsedGet<ChartDataResult>('/api/members/active-by-year');
    /*const results: ChartDataResult = {
      labels: ['2019', '2020', '2021', '2022'],
      total: [6, 12, 6, 8],
      active: [2, 6, 5, 8],
      inactive: [4, 6, 1, 0],
    };*/
    const data = {
      labels: results.labels,
      datasets: [
        {
          label: 'Active',
          data: results.active,
          backgroundColor: theme.palette.primary.light,
        },
        {
          label: 'Inactive',
          data: results.inactive,
          backgroundColor: '#eda8a8',
        },
      ],
    };
    setChartData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {chartData && <Bar options={options} data={chartData} />}
      {!chartData && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size='300px' color='primary' />
        </Box>
      )}
    </>
  );
};

export default MembershipChart;
