# Troubles while working on

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
