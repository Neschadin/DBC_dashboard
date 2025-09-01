"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Spinner,
  addToast,
} from "@heroui/react";
import { api } from "~/trpc/client";
import { useCustomerFilters } from "../_hooks/useCustomerFilters";
import { MobileCustomerCard } from "./MobileCustomerCard";
import { formatDate, getFullName, getInitials } from "~/lib/utils";
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
      <Table
        isHeaderSticky
        aria-label="Customers table"
        selectionMode="none"
        radius="none"
        onRowAction={(key) => handleRowAction(String(key))}
        className="max-md:hidden"
        classNames={{
          base: "h-full overflow-scroll",
          wrapper: "h-full",
        }}
      >
        <TableHeader>
          <TableColumn key="customer" className="w-1/3">
            CUSTOMER
          </TableColumn>
          <TableColumn key="location" className="w-1/3">
            LOCATION
          </TableColumn>
          <TableColumn key="gender" className="w-12">
            GENDER
          </TableColumn>
          <TableColumn key="orders" className="w-10">
            ORDERS
          </TableColumn>
          <TableColumn key="joined" className="w-1/6">
            JOINED
          </TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading customers..." />}
          emptyContent="No customers found"
        >
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar
                    name={getInitials(customer.firstName, customer.lastName)}
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    size="sm"
                  />
                  <div>
                    <p className="font-semibold">
                      {getFullName(customer.firstName, customer.lastName)}
                    </p>
                    <p className="text-gray-500">{customer.email}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <p className="font-medium">
                  {customer.city + ", " + customer.state}
                </p>
                <p className="text-gray-500">{customer.country}</p>
              </TableCell>

              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={customer.gender === "Male" ? "primary" : "secondary"}
                >
                  {customer.gender}
                </Chip>
              </TableCell>

              <TableCell>{customer.ordersCount}</TableCell>

              <TableCell>{formatDate(customer.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
