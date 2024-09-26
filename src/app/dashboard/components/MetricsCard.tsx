import { Card } from '@/components/ui/card';
import React from 'react';

type MetricsCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon }) => {
  return (
    <Card className="flex flex-col items-center justify-center p-4 bg-white shadow-md">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2">{icon}</div>
    </Card>
  );
};

export default MetricsCard;
