"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Avatar,
  Button,
  addToast,
} from "@heroui/react";
import { api } from "~/trpc/client";
import { getFullName, getInitials } from "~/lib/utils";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { LoadMoreButton } from "~/app/_components/LoadMoreButton";
import { MobileOrderCard } from "./_components/MobileOrderCard";
import { DesktopView } from "./_components/DesktopView";
import { CustomerInfo } from "./_components/CutomerInfo";

interface CustomerPageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerPage({ params }: CustomerPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: customer, error: customerError } =
    api.customers.getCustomerById.useQuery({ id });

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.customers.getCustomerOrders.useInfiniteQuery(
    { customerId: id, limit: 20 },
    {
      enabled: !!id,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const orders = ordersData?.pages.flatMap((page) => page.orders) ?? [];

  useEffect(() => {
    if (customerError?.message || ordersError?.message) {
      addToast({
        title: "Failed to load customer",
        description: customerError?.message ?? ordersError?.message ?? "",
        timeout: 5000,
        color: "danger",
        shouldShowTimeoutProgress: true,
      });
    }
  }, [customerError, ordersError]);

  if (!customer) return null;

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="light"
          onPress={() => router.back()}
          startContent={<ChevronLeftIcon className="size-5 shrink-0" />}
        >
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <Avatar
            name={getInitials(customer.firstName, customer.lastName)}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
            size="lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {getFullName(customer.firstName, customer.lastName)}
            </h1>
            <p className="text-gray-600">{customer.email}</p>
          </div>
        </div>
      </div>

      <CustomerInfo customer={customer} />

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Order History</h2>
          {orders.length > 0 && (
            <Chip size="sm" variant="flat">
              {orders.length} orders
            </Chip>
          )}
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="hidden md:block">
              <DesktopView orders={orders} isLoadingOrders={isLoadingOrders} />
            </div>

            {/* Mobile Card View */}
            <div className="space-y-3 md:hidden">
              {orders.map((order) => (
                <MobileOrderCard key={order.id} order={order} />
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <LoadMoreButton
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
