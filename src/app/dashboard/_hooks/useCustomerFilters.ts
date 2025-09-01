"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface CustomerFilters {
  search: string;
  gender: string;
  country: string;
}

export function useCustomerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      gender: searchParams.get("gender") ?? "",
      country: searchParams.get("country") ?? "",
    }),
    [searchParams],
  );

  const updateFilter = useCallback(
    (key: keyof CustomerFilters, value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);

      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }

      router.push(`/dashboard?${newSearchParams.toString()}`);
    },
    [router, searchParams],
  );

  const clearFilters = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const getApiFilters = useCallback(
    () => ({
      limit: 20,
      search: filters.search || undefined,
      gender: filters.gender || undefined,
      country: filters.country || undefined,
    }),
    [filters],
  );

  return {
    filters,
    updateFilter,
    clearFilters,
    getApiFilters,
  };
}
