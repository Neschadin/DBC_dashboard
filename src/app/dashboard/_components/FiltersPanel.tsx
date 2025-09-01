"use client";

import { useEffect, useState, useDeferredValue } from "react";
import { Input, Select, SelectItem, Button, addToast } from "@heroui/react";
import { api } from "~/trpc/client";
import { useCustomerFilters } from "../_hooks/useCustomerFilters";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function FiltersPanel() {
  const {
    data: filterOptions,
    isLoading,
    error,
  } = api.customers.getFilterOptions.useQuery();

  const { filters, updateFilter, clearFilters } = useCustomerFilters();

  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const clearAllFilters = () => {
    setSearchQuery(null);
    clearFilters();
  };

  useEffect(() => {
    if (error?.message) {
      addToast({
        title: "Failed to load filter options",
        description: error.message,
        timeout: 5000,
        color: "danger",
        shouldShowTimeoutProgress: true,
      });
    }
  }, [error]);

  useEffect(() => {
    if (deferredSearchQuery === null) return;
    updateFilter("search", deferredSearchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredSearchQuery]);

  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Search customers"
          placeholder="Name or email..."
          value={searchQuery ?? ""}
          onValueChange={setSearchQuery}
          isClearable
          startContent={<MagnifyingGlassIcon className="size-4 shrink-0" />}
        />
      </div>

      <div>
        <Select
          label="Gender"
          placeholder={isLoading ? "Loading..." : "Select gender"}
          selectedKeys={filters.gender ? [filters.gender] : []}
          onSelectionChange={(keys) => {
            updateFilter("gender", keys.currentKey ?? "");
          }}
          isClearable
          isDisabled={isLoading || !filterOptions?.genders}
        >
          {filterOptions?.genders?.map((gender) => (
            <SelectItem key={gender}>{gender}</SelectItem>
          )) ?? []}
        </Select>
      </div>

      <div>
        <Select
          label="Country"
          placeholder={isLoading ? "Loading..." : "Select country"}
          selectedKeys={filters.country ? [filters.country] : []}
          onSelectionChange={(keys) => {
            updateFilter("country", keys.currentKey ?? "");
          }}
          isClearable
          isDisabled={isLoading || !filterOptions?.countries}
          scrollShadowProps={{
            isEnabled: false,
          }}
        >
          {filterOptions?.countries?.map((country) => (
            <SelectItem key={country}>{country}</SelectItem>
          )) ?? []}
        </Select>
      </div>

      <Button
        variant="flat"
        color="default"
        onPress={clearAllFilters}
        className="w-full"
        disabled={!filters.search && !filters.gender && !filters.country}
      >
        Clear Filters
      </Button>

      {(filters.search || filters.gender || filters.country) && (
        <div className="pt-2 text-center text-xs text-gray-500">
          {
            [filters.search, filters.gender, filters.country].filter(Boolean)
              .length
          }{" "}
          filter(s) applied
        </div>
      )}
    </div>
  );
}
