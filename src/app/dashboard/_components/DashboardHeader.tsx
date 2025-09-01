import { FunnelIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";

interface Props {
  onFiltersOpen: () => void;
}

export function DashboardHeader({ onFiltersOpen }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Customer Dashboard
        </h1>
        <p className="text-sm text-gray-600 md:text-base">
          Manage and view customer information and order history
        </p>
      </div>

      {/* Mobile Filter Button */}
      <Button
        onPress={onFiltersOpen}
        variant="flat"
        size="sm"
        className="lg:hidden"
        startContent={<FunnelIcon className="size-5 shrink-0" />}
      >
        Filters
      </Button>
    </div>
  );
}
