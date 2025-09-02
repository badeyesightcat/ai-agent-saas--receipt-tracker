import {
  anthropic,
  createNetwork,
  getDefaultRoutingAgent,
} from "@inngest/agent-kit";
import { createServer } from "@inngest/agent-kit/server";
import { inngest } from "./client";
import { Events } from "./constants";
import { databaseAgent } from "./agents/databaseAgent";
import { receiptScanningAgent } from "./agents/receiptScanningAgent";

const agentNetwork = createNetwork({
  name: "Agent Team",
  agents: [databaseAgent, receiptScanningAgent],
  defaultModel: anthropic({
    model: "claude-3-5-haiku-latest",
    defaultParameters: {
      max_tokens: 1000,
    },
  }),
  defaultRouter: ({ network }) => {
    const savedToDatabase = network.state.kv.get("saved-to-database");

    if (savedToDatabase !== undefined) {
      // Terminate the agent process if the data has been saved to the database
      return undefined;
    }

    return getDefaultRoutingAgent();
  },
});

export const server = createServer({
  agents: [databaseAgent, receiptScanningAgent],
  networks: [agentNetwork],
});

export const extractAndSaveReceipt = inngest.createFunction(
  { id: "Extract and Save Receipt into Database" },
  { event: Events.EXTRACT_DATA_FROM_RECEIPT_AND_SAVE_TO_DATABASE },
  async ({ event }) => {
    console.log("inngest 가 event 줌", event);
    // [!important] PASS IN the right value to the next call
    // ${event.data.url} DOES NOT pass the right value scheme
    const result = await agentNetwork.run(
      `Extract the key data from this receipt: ${event.data.url.downloadUrl}. Once the data is extracted, save it to the database using the receiptId: ${event.data.receiptId}. Once the receipt is successfully saved to the database you can terminate the agent process.`,
    );

    return result.state.kv.get("receipt");
  },
);
