"use client"; // make this a client component due to check in where we are

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function Header() {
  const pathname = usePathname(); // needs to use "use client" due to checking path
  const isHomepage = pathname === "/";
  const styleClasses = cn(
    "p-4 flex items-center justify-between",
    isHomepage ? "bg-sky-100" : "bg-white border-b-2 border-sky-100",
  );

  return (
    <div className={styleClasses}>
      <Link href="/" className="flex items-center">
        <Shield className="h-6 w-6 text-sky-400 mr-2" />
        <h1 className="text-xl font-semibold text-sky-400">Expensio</h1>
      </Link>

      <div className="flex items-center space-x-4">
        <SignedIn>
          <Link href={"/receipts"}>
            <Button variant={"ghost"}>My receipts</Button>
          </Link>

          <Link href={"/manage-plan"}>
            <Button>Manage Plan</Button>
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
