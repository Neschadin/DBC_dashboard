"use client";

import { Card, CardBody, CardHeader, useDisclosure } from "@heroui/react";
import { CustomersList } from "./_components/CustomersList";
import { DashboardStats } from "./_components/DashboardStats";
import { FiltersPanel } from "./_components/FiltersPanel";
import { MobileFiltersModal } from "./_components/MobileFiltersModal";
import { DashboardHeader } from "./_components/DashboardHeader";

export default function DashboardPage() {
  const {
    isOpen: isFiltersOpen,
    onOpen: onFiltersOpen,
    onClose: onFiltersClose,
  } = useDisclosure();

  return (
    <main className="container mx-auto h-full space-y-4 p-4 md:space-y-6 md:p-6">
      <DashboardHeader onFiltersOpen={onFiltersOpen} />

      <DashboardStats />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
        <div className="hidden lg:col-span-1 lg:block">
          <Card className="sticky top-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Filters</h3>
            </CardHeader>
            <CardBody>
              <FiltersPanel />
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-12rem)] md:h-[800px]">
            <CardHeader className="border-divider justify-between border-b p-4 md:p-6">
              <h3 className="text-base font-semibold md:text-lg">Customers</h3>
              <div className="hidden text-sm text-gray-500 md:block">
                Click on a customer to view details
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <CustomersList />
            </CardBody>
          </Card>
        </div>
      </div>

      <MobileFiltersModal isOpen={isFiltersOpen} onClose={onFiltersClose} />
    </main>
  );
}
