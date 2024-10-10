"use client";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React, { useEffect, useState } from "react";
import DashboardMetrics from "./components/DashboardMetrics";
import BestSellingProducts from "./components/BestSellingProducts";
import MetricsCard from "./components/MetricsCard";
import { FaBox, FaRupeeSign, FaShoppingCart, FaUser } from "react-icons/fa";
import { DateRangePicker } from "@/components/global/DateRangePicker";
import { getDashboardData } from "@/services/dashboard.services";
import TopCustomers from "./components/TopCustomers";
import Offers from "./components/Offers";
import { useRouter } from "next/navigation";

type Props = {};

const Dashboard = (props: Props) => {
  const [metrics, setMetrics] = useState<any>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const router = useRouter()
  useProtectedRoute()

  const fetchMetrics = async () => {
    try {
      const response = await getDashboardData(startDate, endDate);
      setMetrics(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [endDate]);

  if (!metrics) {
    return <div>No Data to display</div>;
  }

  return (
    <div className="mb-4">
      <div className="p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          <MetricsCard
            title="Total Users"
            value={metrics?.users}
            icon={<FaUser className="text-blue-500 text-3xl" />}
            onclick={() => { router.push('/dashboard/users') }}
          />
          <MetricsCard
            title="Total Products"
            value={metrics?.products}
            icon={<FaBox className="text-green-500 text-3xl" />}
            onclick={() => { router.push('/dashboard/products') }}
          />
          <MetricsCard
            title="Total Orders"
            value={metrics?.orders?.total}
            icon={<FaShoppingCart className="text-yellow-500 text-3xl" />}
            onclick={() => { router.push('/dashboard/orders') }}
          />
          <MetricsCard
            title="Total Revenue Generated"
            value={`Rs.${metrics?.totalRevenue}`}
            icon={<FaRupeeSign className="text-yellow-500 text-3xl" />}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 m-2">
        <div className="grid grid-cols-3 gap-4">
          <BestSellingProducts products={metrics?.bestSelling} />
          <TopCustomers products={metrics?.topCustomers} />
          <Offers products={metrics?.Offers} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="max-w-2xl">
            <DashboardMetrics />
          </div>
          <div className="max-w-2xl">
            <DashboardMetrics />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
