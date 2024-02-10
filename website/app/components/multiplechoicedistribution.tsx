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

interface IOption {
  response: string; // option
  response_count: number; // number of responses
}

const options = {
  indexAxis: 'y' as const,
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
    x: {
      ticks: {
        maxRotation: 50,
        minRotation: 30,
        padding: 10,
        autoSkip: false,
        fontSize: 10,
      },
    },
    y: {
      ticks: {
        maxRotation: 50,
        minRotation: 30,
        padding: 5,
        autoSkip: false,
        fontSize: 4,
      },
    },
  },
};

const MultipleChoiceDistribution = ({ data }: { data: IOption[] }) => {
  const chartData = {
    labels: data.map((option) => option.response),
    datasets: [
      {
        label: 'MMultiple Choice Distribution',
        data: data.map((option) => option.response_count),
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="my-8 flex flex-col items-center justify-center">
      <h2>Multiple Choice Distribution</h2>
      <div className="flex items-center flex-wrap w-[50vw] h-[35vw] justify-center gap-4 mt-8 bg-white shadow-lg rounded-md p-4">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MultipleChoiceDistribution;
