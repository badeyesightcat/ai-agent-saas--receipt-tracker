# Troubleshooting journal

- [ ] zod type error on the case of defining parameters prop inside createTool of @inngest/agent-kit:

```
/*
 * parameters prop keeps appearing as to zod type unmatched
 * error message:  Type 'ZodObject<{ receiptUrl: ZodString; }, $strip>' is not assignable to type 'AnyZodType | undefined'.
 */

createTool({
  name: "...",
  description: "...",
  parameters: z.object({
    receiptUrl: z.string(),
  }),

/*
 * installing zod dependency manually is THE reason for keeping it failed to type inferring.
 so, delete the manually installed one, "zod" and use one inside already installed when installing other dependencies such as inngest or @inngest/agent-kit.
*/

[HOWTO] in terminal, implement the line below:

npm rm zod
```

<br /><br /><br />

- [ ] importing openai and anthropic when used as the model prop inside createAgent

```
/*
 * sometimes it needs to be imported from @inngest/agent-kit or its own library, then the warning messages will be gone away
 it can be diversified when it gets further version updates, maybe.
*/

[HOWTO] in code, import it from @inngest/agent-kit:

import { ..., openai } from "@inngest/agent-kit";
import { anthropic } from "inngest";
```

<br /><br /><br />

- [ ] an error passing in the parameter for a task to the receipt-parsing agent

```
/*
 * agent network's default routing system passes in parameter named in "event" for an agent,
 * that is designed in a specific scheme,
 * event: {
 *   data: { ... }, // [!important] be aware of the scheme inside data prop
 *   id: '...',
 *   name: '...',
 *   ts: ...,
 *   user: {}
 * }
*/

[HOWTO] in code, pass in the right hierachy of the value you intend to pass over,

```

<br /><br /><br />

- [ ] an error as to referring an item of db due to the wrong identifier while passing in parameters

```
/*
 * in the databaseAgent, with the use of updateReceiptWithExtractedData function,
 * arguments have a prop named "id", but it should be replaced with one named "receiptId"
*/

[HOWTO] in code, pass in the right prop name with 'receiptId' other than 'id',

```

<br /><br /><br />

- [ ] an error saying "user not authenticated" while extracting data and write them onto the db

```
/*
 * An error emerging from a distiction between client-side and server-side execution in convex application,

 * 1. client-side authentication: user's interaction at the app, then Clerk JWT token would be attached to Convex functions.
 * 2. server-side execution: Inngest agent uns on a server having a different session from the user's browser. But ConvexHttpClient is a unauthenticated client which Inngest uses.
 * 3. When Inngest calls the updateReceiptWithExtractedData mutation, it does its work without any user identity. That makes the error occur.

 In order to fix,
 cannot use user-based authentication for server-to-server interaction.
 should use internal mutation other than mutation.

 internal mutation can only be called from other backend functions, and bypass the standard authentication flow which have the same access to database and other context.

 but Inngest is an external service which cannot call an internal mutation directly, so the pattern is:
 * 1. Create a public(regular) mutation that can be called by Inngest agent and should be secured with a secret.
 * 2. The public mutation will call an internal mutation that performs the actual database update.

*/
****
[HOWTO]
1. Create an internalMutation in Convex that contains the core logic.
2. Create a public mutation that acts as a secure gateway, callable by your Inngest agent.

[WHERE] receipts.ts
so, in order to achieve that, split the function below into two
(ASIS) function updateReceiptWithExtractedData
(TOBE) 1. function internalUpdateReceiptWithExtractedData: internalMutation that performs the database patch. Don't have user authentication logic.
2. function updateReceiptWithExtractedData: public facing mutation that Inngest agent will call. this validates a secret before calling the internal function. This will verify against an environment variable. Once the token is valid, then it will cann the internal mutation.

[WHERE] databaseAgent.ts
1. Tool saveToDatabaseTool has to have userId as its parameters
2. Pass the userId and the secret environment variable in the call to the Convex mutation.

[WHERE] .env.local
1. Generate a strong, random secret string.
2. Go to Convex project settings.
3. Under "Environment Variables", add a new variable named INNGEST_SECRET and paste the secret string as the value.
4. Add the same secret to the environment where the Inngest agent is running such as .env.local file.
```

<br /><br /><br />

- [ ] an error as to scanning PDF files and extracting data from them

```
/*
 * Use of the model for scanning receipts, GPT-4o-mini was not good enough.
*/

[HOWTO]
1. Search for good AI model for analyzing PDF files especially among OPENAI models,
2. The result said that GPT-4o is the most suitable one for the task.
3. And the model solved the bad results of scanning PDFs.

```
