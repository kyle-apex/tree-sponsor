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
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { Bar } from 'react-chartjs-2';
import useTheme from '@mui/system/useTheme';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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
      text: 'Percent Continuing Donation Over Time',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return ' ' + context.formattedValue + '%';
        },
      },
    },
    legend: { display: false },
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

options.indexAxis = 'y';

const MembershipAttritionChart = ({ chartData }: { chartData: number[] }) => {
  const theme = useTheme();

  const data = chartData && {
    labels: chartData.map((_val, idx) => 'Year ' + String(idx + 1)),
    datasets: [
      {
        label: 'Percentage Retained',
        data: chartData,
        backgroundColor: theme.palette.secondary.light,
      },
    ],
  };

  return (
    <>
      {data && <Bar height='300px' options={options} data={data} />}
      {!data && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size='300px' color='primary' />
        </Box>
      )}
    </>
  );
};

export default MembershipAttritionChart;
