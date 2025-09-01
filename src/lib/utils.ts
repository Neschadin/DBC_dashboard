import type { Customer } from "~/types/types";

export const getInitials = (
  firstName: string | null,
  lastName: string | null,
) => {
  const first = firstName?.charAt(0) ?? "";
  const last = lastName?.charAt(0) ?? "";

  return (first + last).toUpperCase();
};

export const getFullName = (
  firstName: string | null,
  lastName: string | null,
) => {
  return firstName && lastName ? `${firstName} ${lastName}` : "Unknown";
};

export const getFullAddress = (customer: Omit<Customer, "ordersCount">) => {
  if (!customer) return "Unknown";
  const parts = [
    customer.street,
    customer.city,
    customer.state,
    customer.postCode,
    customer.country,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown";
};

export const formatDate = (date: Date | null) => {
  if (!date) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
};
