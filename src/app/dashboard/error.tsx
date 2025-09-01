"use client";

import { Card, CardBody, CardFooter, CardHeader, Button } from "@heroui/react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <div className="container mx-auto grid h-full place-items-center space-y-4 p-4 md:space-y-6 md:p-6">
      <Card className="gap-4 p-6 text-center text-2xl">
        <CardHeader className="justify-center text-center font-semibold">
          Something went wrong!
        </CardHeader>
        <CardBody className="justify-center text-center text-gray-800">
          {error.message}
        </CardBody>
        <CardFooter className="justify-center">
          <Button size="lg" radius="sm" onPress={reset}>
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
