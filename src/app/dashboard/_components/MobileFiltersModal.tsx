"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { FiltersPanel } from "./FiltersPanel";

interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFiltersModal({
  isOpen,
  onClose,
}: MobileFiltersModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className="lg:hidden"
      scrollBehavior="inside"
      classNames={{
        wrapper: "items-end",
        base: "m-0 rounded-t-lg rounded-b-none max-h-[80vh]",
        body: "py-4",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-row items-center justify-between px-6 py-4">
          <h3 className="text-lg font-semibold">Filter Customers</h3>
        </ModalHeader>

        <ModalBody className="border-divider border-y-1 px-6">
          <FiltersPanel />
        </ModalBody>

        <ModalFooter className="px-6 py-4">
          <Button color="primary" onPress={onClose} className="w-full">
            Apply Filters
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
