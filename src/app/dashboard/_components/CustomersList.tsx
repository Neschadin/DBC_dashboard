"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Spinner, addToast } from "@heroui/react";
import { api } from "~/trpc/client";
import { useCustomerFilters } from "../_hooks/useCustomerFilters";
import { MobileCustomerCard } from "./MobileCustomerCard";
import { DesktopView } from "./DesktopView";
import { LoadMoreButton } from "~/app/_components/LoadMoreButton";

export function CustomersList() {
  const { getApiFilters } = useCustomerFilters();
  const router = useRouter();

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = api.customers.getCustomers.useInfiniteQuery(getApiFilters(), {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
  });

  const customers = useMemo(
    () => data?.pages.flatMap((page) => page.customers) ?? [],
    [data],
  );

  const handleRowAction = (customerId: string) => {
    router.push(`/customer/${customerId}`);
  };

  useEffect(() => {
    if (error?.message) {
      addToast({
        title: "Failed to load customers",
        description: error.message,
        timeout: 5000,
        color: "danger",
        shouldShowTimeoutProgress: true,
      });
    }
  }, [error]);

  return (
    <div className="flex h-full flex-col">
      {/* max-md:hidden */}
      <DesktopView
        customers={customers}
        isLoading={isLoading}
        handleRowAction={handleRowAction}
      />

      {/* Mobile Card View */}
      <div className="flex-1 overflow-auto p-4 md:hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" label="Loading customers..." />
          </div>
        ) : (
          <div className="space-y-3">
            {customers.map((customer) => (
              <MobileCustomerCard
                key={customer.id}
                customer={customer}
                onPress={() => handleRowAction(customer.id)}
              />
            ))}
          </div>
        )}
      </div>

      {hasNextPage && (
        <div className="border-divider flex justify-center border-y-1 p-4">
          <LoadMoreButton
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      )}

      {customers.length > 0 && (
        <div className="py-2 text-center text-xs text-gray-500">
          Showing {customers.length} customers
          {hasNextPage && " (load more to see all)"}
        </div>
      )}
    </div>
  );
}
