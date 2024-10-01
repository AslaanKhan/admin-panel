"use client";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React, { useState } from "react";
import DashboardMetrics from "./components/DashboardMetrics";
import BestSellingProducts from "./components/BestSellingProducts";
import MetricsCard from "./components/MetricsCard";
import { FaBox, FaShoppingCart, FaUser } from "react-icons/fa";
import { DateRangePicker } from "@/components/global/DateRangePicker";

type Props = {};

const Dashboard = (props: Props) => {
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Sample data (replace this with your actual data fetching logic)
  const totalUsers = 150; // Fetch this data from your API
  const totalProducts = 200; // Fetch this data from your API
  const totalOrders = 300; // Fetch this data from your API

  return (
    <div className="mb-4">
      <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Date Range Picker */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <MetricsCard
          title="Total Users"
          value={totalUsers}
          icon={<FaUser className="text-blue-500 text-3xl" />}
        />
        <MetricsCard
          title="Total Products"
          value={totalProducts}
          icon={<FaBox className="text-green-500 text-3xl" />}
        />
        <MetricsCard
          title="Total Orders"
          value={totalOrders}
          icon={<FaShoppingCart className="text-yellow-500 text-3xl" />}
        />
      </div>
    </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="max-w-2xl">
          <DashboardMetrics />
        </div>
        <div className="max-w-2xl">
          <DashboardMetrics />
        </div>
      </div>
      <BestSellingProducts />
    </div>
  );
};

export default Dashboard;
