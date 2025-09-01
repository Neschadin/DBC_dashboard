"use client";

import { Card, CardBody, Avatar, Chip } from "@heroui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { Customer } from "~/types/types";
import { formatDate, getFullName, getInitials } from "~/lib/utils";

type Props = {
  customer: Customer;
  onPress: () => void;
};

export function MobileCustomerCard({ customer, onPress }: Props) {
  const getLocation = () => {
    const parts = [customer.city, customer.state, customer.country].filter(
      Boolean,
    );
    return parts.length > 0 ? parts.join(", ") : "Unknown";
  };

  return (
    <Card
      className="w-full cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
      isPressable
      onPress={onPress}
    >
      <CardBody className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar
            name={getInitials(customer.firstName, customer.lastName)}
            className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
            size="md"
          />

          <div className="min-w-0 flex-1">
            <div className="mb-2">
              <h3 className="truncate text-base font-semibold text-gray-900">
                {getFullName(customer.firstName, customer.lastName)}
              </h3>
              <p className="truncate text-sm text-gray-600">{customer.email}</p>
            </div>

            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-gray-500">
                  📍 {getLocation()}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-1">
                {customer.gender && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color={customer.gender === "Male" ? "primary" : "secondary"}
                  >
                    {customer.gender}
                  </Chip>
                )}
                <Chip
                  size="sm"
                  variant="flat"
                  color={customer.ordersCount > 0 ? "success" : "default"}
                >
                  📦 {customer.ordersCount}
                </Chip>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Joined: {formatDate(customer.createdAt)}
              </p>

              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
