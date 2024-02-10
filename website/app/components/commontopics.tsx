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
  topic_id: string;
  chart_data: any;
  average_sentiment: number;
  topic_count: number;
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

const CommonTopics = ({ topics }: { topics: ITopic[] }) => {
  return (
    <div className="mt-8 flex flex-col items-center">
      <h2>Most Common Topics</h2>
      <div className="flex items-center flex-wrap justify-center gap-4 mt-8 bg-white shadow-lg rounded-md p-4">
        {topics.map((topic: ITopic, i: number) => {
          return (
            <div
              key={i}
              className="h-[300px] w-[400px] text-center flex flex-col items-center"
            >
              <div>
                Topic {topic.topic_id?.split('-')[2]} ({topic.topic_count}{' '}
                responses)
              </div>
              <Bar data={topic.chart_data} options={options} />
              <div>Average sentiment: {topic.average_sentiment}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommonTopics;
