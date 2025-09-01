import {
  Table,
  TableBody,
  TableColumn,
  TableCell,
  TableHeader,
  Spinner,
  TableRow,
  Chip,
  Avatar,
} from "@heroui/react";
import { formatDate, getFullName, getInitials } from "~/lib/utils";
import type { Customer } from "~/types/types";

type Props = {
  customers: Customer[];
  isLoading: boolean;
  handleRowAction: (customerId: string) => void;
};

export function DesktopView({ customers, isLoading, handleRowAction }: Props) {
  return (
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
  );
}
