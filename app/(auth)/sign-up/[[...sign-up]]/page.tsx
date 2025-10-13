import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { LoaderCircle, Container } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-16 lg:pt-0">
          <h1 className="font-bold text-3xl text-neutral-500">Welcome back!</h1>
          <p className="text-base text-neutral-400">
            Log in or create an account to get back to the service.
          </p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignUp />
          </ClerkLoaded>
          <ClerkLoading>
            <LoaderCircle className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full bg-blue-400 hidden lg:flex justify-center items-center">
        <Link href="/">
          <Container color="#fff" size={96} />
        </Link>
      </div>
    </div>
  );
}
