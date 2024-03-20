import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const options = {
  indexAxis: 'x' as const,
  layout: {
    autoPadding: true,
  },
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  scales: {
    y: {
      ticks: {
        padding: 5,
        autoSkip: false,
        max: 100,
      },
    },
    x: {
      ticks: {
        padding: 10,
        autoSkip: false,
      },
    },
  },
};

const SentimentDistribution = ({
  positive,
  negative,
  title,
}: {
  positive: number;
  negative: number;
  title?: string;
}) => {
  // absolute value of negative
  const absNegative = Math.abs(negative);
  // total number of responses
  const total = positive + absNegative;
  // percentage of positive responses
  const percentagePositive = (positive / total) * 100;
  // percentage of negative responses
  const percentageNegative = (absNegative / total) * 100;

  const data = {
    labels: ['Positive', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: [percentagePositive, percentageNegative],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="my-8 flex flex-col items-center justify-center">
      <h2 className="text-center">{title}</h2>
      <div className="flex items-center flex-wrap h-[400px] w-full justify-center gap-4 mt-8 bg-white shadow-lg rounded-md p-4">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default SentimentDistribution;
