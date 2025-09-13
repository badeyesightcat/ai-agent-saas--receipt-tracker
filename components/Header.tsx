"use client"; // make this a client component due to check in where we are

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function Header() {
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
      <Link href="/" className="flex items-center">
        <h1 className="text-2xl font-semibold text-blue-400 flex items-center gap-2 py-1.5 font-serif">
          where&apos; my money, then?
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
          <SignInButton mode="modal">
            <Button>Login</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

export default Header;
