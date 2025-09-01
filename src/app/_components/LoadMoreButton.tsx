import { Button, Spinner } from "@heroui/react";

interface Props {
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export function LoadMoreButton({ fetchNextPage, isFetchingNextPage }: Props) {
  return (
    <Button
      variant="flat"
      onPress={() => fetchNextPage()}
      disabled={isFetchingNextPage}
      startContent={isFetchingNextPage ? <Spinner size="sm" /> : null}
    >
      {isFetchingNextPage ? "Loading..." : "Load More"}
    </Button>
  );
}
