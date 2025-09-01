import { Card, CardBody, Chip } from "@heroui/react";
import { formatCurrency, formatDate } from "~/lib/utils";
import type { Order } from "~/types/types";

export function MobileOrderCard({ order }: { order: Order }) {
  return (
    <Card className="border">
      <CardBody className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-semibold">#{order.orderNumber}</p>
            <p className="text-sm text-gray-500">{order.itemName}</p>
            <p className="text-xs text-gray-400">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600">
              {formatCurrency(order.price, order.currency)}
            </p>
            <p className="text-sm text-gray-500">Qty: {order.amount}</p>
            <Chip
              size="sm"
              color={order.shippedAt ? "success" : "warning"}
              variant="flat"
              className="mt-1"
            >
              {order.shippedAt ? "Shipped" : "Processing"}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
