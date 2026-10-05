"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
// import { success } from "zod";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="items-center flex gap-8">
        <div className="">
          <Link href="/">
            <h1 className="text-3xl font-bold">
              Next <span className="text-blue-500">Pro</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link className={buttonVariants({ variant: "ghost" })} href="/">
            Home
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/blog">
            Blog
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/create">
            Create
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isLoading ? null : isAuthenticated ? (
          <Button
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.add({
                      type: "success",
                      description: "Logged Out Successfully",
                    });
                    router.push("/");
                  },
                  onError: (error: { error: { message: string } }) => {
                    toast.add({
                      type: "error",
                      description: error.error.message,
                    });
                  },
                },
              })
            }
          >
            LogOut
          </Button>
        ) : (
          <>
            <Link className={buttonVariants()} href={`/auth/signup`}>
              Register
            </Link>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={`/auth/login`}
            >
              Login
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
