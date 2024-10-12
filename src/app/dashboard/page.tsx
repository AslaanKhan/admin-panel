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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useSwipeable } from "react-swipeable";

type Props = {};

const Dashboard = (props: Props) => {
  const [metrics, setMetrics] = useState<any>();
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const router = useRouter()
  useProtectedRoute()
  const metricsData = [
    {
      title: "Total Users",
      value: metrics?.users,
      icon: <FaUser className="text-blue-500 text-3xl" />,
      route: "/dashboard/users",
    },
    {
      title: "Total Products",
      value: metrics?.products,
      icon: <FaBox className="text-green-500 text-3xl" />,
      route: "/dashboard/products",
    },
    {
      title: "Total Orders",
      value: metrics?.orders?.total,
      icon: <FaShoppingCart className="text-yellow-500 text-3xl" />,
      route: "/dashboard/orders/order",
    },
    {
      title: "Total Revenue Generated",
      value: `Rs.${metrics?.totalRevenue}`,
      icon: <FaRupeeSign className="text-yellow-500 text-3xl" />,
      route: null, // No route for this metric
    },
  ];

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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => document.getElementById("carousel-next")?.click(),
    onSwipedRight: () => document.getElementById("carousel-previous")?.click(),
    preventScrollOnSwipe: true,
  });

  const MetricsCarousel = ({ metrics }) => (
    <Carousel className="w-full max-w-xs mx-auto">
      <CarouselContent>
        <CarouselItem>
          <div className="p-1">
            <BestSellingProducts products={metrics?.bestSelling} />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <TopCustomers products={metrics?.topCustomers} />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Offers offers={metrics?.Offers} />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );

  const MetricsContent = ({ metrics }) => (
    <div className="gap-4 grid grid-cols-3">
      <BestSellingProducts products={metrics?.bestSelling} />
      <TopCustomers products={metrics?.topCustomers} />
      <Offers offers={metrics?.Offers} />
    </div>
  );


  if (!metrics) {
    return <div>No Data to display</div>;
  }

  return (
    <div className="my-4">
      <div className="md:p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <div className="mt-4">
          <div className="block md:hidden">
            <Carousel {...swipeHandlers} className="w-full">
              <CarouselContent>
                {metricsData.map((metric, index) => (
                  <CarouselItem key={index}>
                    <MetricsCard
                      title={metric.title}
                      value={metric.value}
                      icon={metric.icon}
                      onclick={metric.route ? () => router.push(metric.route) : undefined}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
            {metricsData.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                onclick={metric.route ? () => router.push(metric.route) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 my-2">
        <div className="">
          <div className="md:hidden">
            <MetricsCarousel {...swipeHandlers} metrics={metrics} />
          </div>
          <div className="hidden md:block">
            <MetricsContent metrics={metrics} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className="max-w-2xl">
            <DashboardMetrics chartData={metrics?.userMetricsByDate} type="users" />
          </div>
          <div className="max-w-2xl mb-4">
            <DashboardMetrics chartData={metrics?.productMetricsByDate} type="products" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard
