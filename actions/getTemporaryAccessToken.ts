"use server"; // Make this as a server action

import { currentUser } from "@clerk/nextjs/server";

// Initialize Schematic SDK
import { SchematicClient } from "@schematichq/schematic-typescript-node";
const apiKey = process.env.SCHEMATIC_API_KEY;
const client = new SchematicClient({ apiKey });

// Get temporary access token for the current user
export async function getTemporaryAccessToken() {
  console.log("Getting temporary access token");
  const user = await currentUser();

  if (!user) {
    console.log("No user found, returning nul");
    return null;
  }

  console.log(`Issuing temporary access token for user: ${user.id}`);
  const res = await client.accesstokens.issueTemporaryAccessToken({
    resource_type: "company",
    lookup: { id: user.id }, // The lookup will vary depending on how you have configured your company keys
  });

  console.log(
    "Token response received:",
    res.data ? "Token received" : "No token in response",
  );
  return res.data?.token;
}
