import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  chartData?:any
  type?:string
};

const DashboardMetrics = ({ chartData, type }: Props) => {
  const data = {
    labels: chartData && chartData?.map((data)=>new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(data.date))),
    datasets: [
      {
        label: `${type === 'users' ? 'Users' : 'Products'}`,
        data: chartData && chartData?.map((data)=>data.count),
        backgroundColor: `${type === 'users' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'}`,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${type === 'users' ? 'Users' : 'Products'} Metrics`,
      },
    },
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{type === 'users' ? 'Users' : 'Products'} Metrics</h2>
      <div className="flex justify-between">
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardMetrics;
