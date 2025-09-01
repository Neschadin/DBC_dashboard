"use client";

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  User,
  Skeleton,
  Link,
} from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import type { User as UserProps } from "next-auth";

function UserSkeleton() {
  return (
    <NavbarItem>
      <div className="flex gap-3">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </NavbarItem>
  );
}

function SignedInItems(user: UserProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <NavbarItem className="hidden h-10 sm:block">
        <User
          name={user.name ?? "User name"}
          description={user.email}
          avatarProps={{
            src: user.image ?? undefined,
            name: user.name?.charAt(0).toUpperCase(),
          }}
        />
      </NavbarItem>
      <NavbarItem>
        <Button
          className="rounded-md border-gray-500 text-gray-500"
          variant="bordered"
          onPress={handleSignOut}
          size="sm"
        >
          Exit
        </Button>
      </NavbarItem>
    </>
  );
}

function SignedOutItems() {
  return (
    <>
      <NavbarItem>
        <Button
          as={Link}
          className="rounded-md border-gray-500 bg-gray-200 text-gray-500"
          href="/login"
          variant="bordered"
          size="sm"
        >
          Login
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button
          as={Link}
          className="rounded-md bg-blue-500"
          href="/register"
          color="primary"
          size="sm"
        >
          Registration
        </Button>
      </NavbarItem>
    </>
  );
}

function Navigation() {
  const { data: session, status } = useSession();

  const renderNavContent = () => {
    if (status === "unauthenticated") return <SignedOutItems />;
    if (status === "authenticated") return <SignedInItems {...session.user} />;
    return <UserSkeleton />;
  };

  return (
    <Navbar className="border-divider border-b bg-gray-300 shadow-md">
      <NavbarBrand>
        <Link href="/" className="font-bold text-gray-500 sm:text-lg">
          DBC App
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">{renderNavContent()}</NavbarContent>
    </Navbar>
  );
}

export { Navigation };
