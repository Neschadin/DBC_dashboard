"use client";

import { addToast, Card, CardBody, Skeleton } from "@heroui/react";
import { api } from "~/trpc/client";
import { useEffect } from "react";

export function DashboardStats() {
  const { data: stats, isLoading, error } = api.customers.getStats.useQuery();

  const statsData = [
    {
      title: "Total Customers",
      value: stats?.totalCustomers ?? 0,
      icon: "👥",
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: "📦",
      color: "text-green-600",
    },
    {
      title: "Delivered Orders",
      value: stats?.deliveredOrders ?? 0,
      icon: "🚀",
      color: "text-purple-600",
    },
  ];

  useEffect(() => {
    if (error?.message) {
      addToast({
        title: "Failed to load dashboard stats",
        description: error.message,
        timeout: 5000,
        color: "danger",
        shouldShowTimeoutProgress: true,
      });
    }
  }, [error]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="shadow-md transition-shadow hover:shadow-lg"
        >
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-1/2 rounded-md" />
                ) : (
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="text-3xl opacity-80">{stat.icon}</div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
