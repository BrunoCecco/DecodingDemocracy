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

interface ITopic {
  0: string; // id
  1: any; // chart data
  2: number; // number of responses
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
        minRotation: 0,
        padding: 5,
        autoSkip: false,
        fontSize: 4,
      },
    },
  },
};

const CommonTopics = ({
  topics,
  title,
}: {
  topics: ITopic[];
  title?: string;
}) => {
  console.log(topics);
  return (
    <div className="mt-8 flex flex-col items-center">
      <h2>{title}</h2>
      <div className="flex items-center flex-wrap justify-center mt-8 gap-4">
        {topics.map((topic: ITopic, i: number) => {
          return (
            <div
              key={i}
              className="w-[33vw] h-[20vw] text-center flex flex-col items-center bg-white rounded-md p-4"
            >
              <div>
                Topic {topic[0]?.split('-')[2]} ({topic[2]} responses)
              </div>
              <Bar data={topic[1]} options={options} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommonTopics;
