"use client"; // make this a client component due to check in where we are

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container } from "lucide-react";

function HomeHeader() {
  const pathname = usePathname(); // needs to use "use client" due to checking path
  const isHomepage = pathname === "/";
  const styleClasses = isHomepage ? "" : "bg-white border-b-2";

  return (
    <div
      className={cn(
        "p-4 flex items-center justify-between border-slate-200",
        styleClasses,
      )}
    >
      <Link href="/" className="flex items-center gap-1">
        <Container className="text-blue-400 text-3xl" />
        <h1 className="text-xl font-bold text-blue-400 flex items-center py-1.5">
          money container
        </h1>
      </Link>

      <div className="flex items-center space-x-4">
        <SignedIn>
          <Link href={"/receipts"}>
            <Button variant={"ghost"}>My receipts</Button>
          </Link>

          <Link href={"/manage-plan"}>
            <Button className="bg-slate-300 text-slate-900 hover:bg-slate-400 hover:text-white">
              Manage Plan
            </Button>
          </Link>

          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="redirect">
            <Button>Login</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

export default HomeHeader;
