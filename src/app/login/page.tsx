"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Input,
  Link,
} from "@heroui/react";
import { emailSchema, passwordSchema } from "~/lib/zod";
import { ErrorCodes, ErrorMessages } from "~/lib/errors";
import { PassVisibilityToggler } from "../_components/PassVisibilityToggler";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handlePassVisibilityToggle = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const values = Object.fromEntries(new FormData(e.currentTarget));

        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (res?.error) {
          setError(ErrorMessages[res.code as keyof typeof ErrorMessages]);
        } else if (res?.ok) {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (error) {
        console.error("Login error:", error);
        setError(ErrorMessages[ErrorCodes.UNEXPECTED_ERROR]);
      }
    });
  };

  return (
    <main className="container mx-auto grid h-full place-items-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-tl from-white to-violet-50">
        <CardHeader className="flex flex-col items-center pb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Enter the dashboard
          </h1>
          <p className="text-gray-600">Enter your credentials</p>
        </CardHeader>

        <CardBody>
          <Form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="your@email.com"
              isRequired
              variant="bordered"
              radius="sm"
              validate={(val) => {
                const res = emailSchema.safeParse(val);
                return res.success || res.error.errors[0]?.message;
              }}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              name="password"
              isRequired
              variant="bordered"
              type={isPasswordVisible ? "text" : "password"}
              endContent={
                <PassVisibilityToggler
                  handler={handlePassVisibilityToggle}
                  isVisible={isPasswordVisible}
                />
              }
              validate={(val) => {
                const res = passwordSchema.safeParse(val);
                return res.success || res.error.errors[0]?.message;
              }}
            />

            {error && (
              <p className="bg-danger-50 text-danger-500 rounded-md px-3 py-2 text-sm">
                {error}
              </p>
            )}

            <Button
              type="submit"
              color="primary"
              size="lg"
              radius="sm"
              fullWidth
              isLoading={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </CardBody>

        <CardFooter>
          <p className="mx-auto text-sm text-gray-600">
            Doesn&apos;t have an account?{" "}
            <Link href="/register" color="primary" className="font-medium">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
