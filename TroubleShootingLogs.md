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
