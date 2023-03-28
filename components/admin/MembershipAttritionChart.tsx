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
  PointElement,
  LineElement,
  LineController,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { Bar, Chart } from 'react-chartjs-2';
import useTheme from '@mui/system/useTheme';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, LineController);

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
          return ' ' + context.formattedValue + '%' + ' - ' + context.dataset.label;
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
};

options.indexAxis = 'y';

const MembershipAttritionChart = ({ chartData }: { chartData: { percentage: number; bestPercentage: number }[] }) => {
  const theme = useTheme();

  const data = chartData && {
    labels: chartData.map((_val, idx) => 'Year ' + String(idx + 1)),
    datasets: [
      {
        label: 'Retained',
        data: chartData.map(data => data.percentage),
        backgroundColor: theme.palette.secondary.light,
        order: 0,
      },
      {
        label: 'Best Possible (if everyone stays active)',
        data: chartData.map(data => data.bestPercentage),
        backgroundColor: '#f1f1f1',
        type: 'line',
        order: 1,
      },
    ],
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment

  return (
    <>
      {/* 
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore */}
      {data && <Chart type='bar' height='300px' options={options} data={data} />}
      {!data && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size='300px' color='primary' />
        </Box>
      )}
    </>
  );
};

export default MembershipAttritionChart;
