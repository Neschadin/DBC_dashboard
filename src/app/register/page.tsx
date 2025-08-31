"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
import { api } from "~/trpc/client";
import { emailSchema, nameSchema, passwordSchema } from "~/lib/zod";
import { PassVisibilityToggler } from "../_components/PassVisibilityToggler";

export default function RegisterPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      router.push("/login?message=registration_success");
    },
  });

  const handlePassVisibilityToggle = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const handleConfirmPassVisibilityToggle = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    registerMutation.mutate({
      name: typeof name === "string" ? name : "",
      email: typeof email === "string" ? email : "",
      password: typeof password === "string" ? password : "",
    });
  };

  return (
    <main className="container mx-auto grid h-full place-items-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-tl from-white to-violet-50">
        <CardHeader className="flex flex-col items-center pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Register</h1>
          <p className="text-gray-600">Create a new account</p>
        </CardHeader>

        <CardBody>
          <Form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              placeholder="Enter your name"
              name="name"
              isRequired
              variant="bordered"
              validate={(val) => {
                const res = nameSchema.safeParse(val);
                return res.success || res.error.errors[0]?.message;
              }}
            />

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
              onValueChange={setPassword}
              validate={(val) => {
                const res = passwordSchema.safeParse(val);
                return res.success || res.error.errors[0]?.message;
              }}
            />

            <Input
              label="Confirm Password"
              placeholder="Repeat your password"
              name="confirmPassword"
              isRequired
              variant="bordered"
              type={isConfirmPasswordVisible ? "text" : "password"}
              endContent={
                <PassVisibilityToggler
                  handler={handleConfirmPassVisibilityToggle}
                  isVisible={isConfirmPasswordVisible}
                />
              }
              validate={(val) =>
                (!!val && password === val) || "Passwords do not match"
              }
            />

            {registerMutation.error && (
              <p className="rounded-medium bg-danger-50 text-danger-600 px-3 py-2 text-sm">
                {registerMutation.error.message}
              </p>
            )}

            <Button
              type="submit"
              color="primary"
              radius="sm"
              size="lg"
              fullWidth
              isLoading={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Registration..." : "Register"}
            </Button>
          </Form>

          <CardFooter>
            <p className="mx-auto text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" color="primary" className="font-medium">
                Login
              </Link>
            </p>
          </CardFooter>
        </CardBody>
      </Card>
    </main>
  );
}
