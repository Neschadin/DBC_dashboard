import {
  Table,
  TableBody,
  TableColumn,
  TableCell,
  TableHeader,
  Spinner,
  TableRow,
  Chip,
} from "@heroui/react";
import { formatCurrency, formatDate } from "~/lib/utils";
import type { Order } from "~/types/types";

type Props = {
  orders: Order[];
  isLoadingOrders: boolean;
};

export function DesktopView({ orders, isLoadingOrders }: Props) {
  return (
    <Table aria-label="Customer orders">
      <TableHeader>
        <TableColumn>ORDER</TableColumn>
        <TableColumn>ITEM</TableColumn>
        <TableColumn>AMOUNT</TableColumn>
        <TableColumn>QUANTITY</TableColumn>
        <TableColumn>DATE</TableColumn>
        <TableColumn>STATUS</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isLoadingOrders}
        loadingContent={<Spinner label="Loading orders..." />}
        emptyContent="No orders found"
      >
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <p className="font-semibold">#{order.orderNumber}</p>
            </TableCell>
            <TableCell>
              <p className="font-medium">{order.itemName}</p>
            </TableCell>
            <TableCell>
              <p className="font-bold text-green-600">
                {formatCurrency(order.price, order.currency)}
              </p>
            </TableCell>
            <TableCell>
              <p>{order.amount}</p>
            </TableCell>
            <TableCell>
              <p className="text-sm">{formatDate(order.createdAt)}</p>
            </TableCell>
            <TableCell>
              {order.shippedAt ? (
                <Chip size="sm" color="success" variant="flat">
                  Shipped
                </Chip>
              ) : (
                <Chip size="sm" color="warning" variant="flat">
                  Processing
                </Chip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
