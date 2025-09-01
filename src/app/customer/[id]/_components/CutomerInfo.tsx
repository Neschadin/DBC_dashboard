import type { Customer } from "~/types/types";
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { formatDate, getFullAddress } from "~/lib/utils";

type Props = {
  customer: Omit<Customer, "ordersCount">;
};

export function CustomerInfo({ customer }: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Customer Information</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{customer.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <Chip
              size="sm"
              variant="flat"
              color={customer.gender === "Male" ? "primary" : "secondary"}
            >
              {customer.gender}
            </Chip>
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer Since</p>
            <p className="font-medium">{formatDate(customer.createdAt)}</p>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{getFullAddress(customer)}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
