import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Button } from '@/components/ui/button';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardMetrics = () => {
  // Sample data
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Users',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Products Sold',
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
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
        text: 'User and Product Metrics',
      },
    },
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard Metrics</h2>
      <div className="flex justify-between">
        <Button>Filter by Date</Button>
        <Button>Export Data</Button>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardMetrics;
