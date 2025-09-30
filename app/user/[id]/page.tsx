"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function User() {
  const users = useQuery(api.users.getUsers);
  const addUser = useMutation(api.users.add);

  return (
    <div>
      {JSON.stringify(users, null, 4)}
      <Button onClick={() => addUser({ name: "Charlie" })}>Add a user</Button>
    </div>
  );
}
