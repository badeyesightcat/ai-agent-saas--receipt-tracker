"use client";

import Test from "@/components/Test";
import { useState } from "react";

// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Button } from "@/components/ui/button";
// import { currentUser } from "@clerk/nextjs/server";

export default function User() {
  // const users = useQuery(api.users.getUsers);
  // const addUser = useMutation(api.users.add);
  // const user = currentUser();
  const [open, setOpen] = useState(0);
  const toggleView = (num: number) => {
    setOpen(num);
  };

  return (
    <div className="flex flex-col gap-4">
      <Test open={open === 0} toggleView={() => toggleView(0)} title="First">
        Hello there
      </Test>
      <Test open={open === 1} toggleView={() => toggleView(1)} title="Second">
        I am a second world!
      </Test>
    </div>
  );
}
