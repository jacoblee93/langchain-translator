import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

import * as fs from "fs";

import { Client } from "langsmith";
import * as hub from "langchain/hub";
import { ChatPromptTemplate } from "langchain/prompts";
import { AIMessage } from "langchain/schema";

async function run() {
  const prompt = await hub.pull<ChatPromptTemplate>("jacob/langchain-python-to-js");

  const client = new Client({});

  const filenames = fs.readdirSync("./dataset/training/python");

  const examples = [];

  for (const filename of filenames) {
    examples.push([
      await prompt.formatMessages({ code: fs.readFileSync(`./dataset/training/python/${filename}`).toString() }),
      new AIMessage({
        content: `\`\`\`typescript\n${fs.readFileSync(`./dataset/training/typescript/${filename}`).toString()}\n\`\`\``
      }),
    ] as const);
  }

  const datasetName = `langchain-python-to-typescript`;

  // Storing inputs in a dataset lets us
  // run chains and LLMs over a shared set of examples.
  const dataset = await client.createDataset(datasetName, {
    description: "Example LangChain Python to TypeScript files",
    dataType: "chat",
  });

  for (const [formattedInputMessages, outputMessage] of examples) {
    await client.createExample(
      { input: formattedInputMessages.map((message) => ({type: message._getType(), data: {content: message.content}})) },
      { output: {type: outputMessage._getType(), data: {content: outputMessage.content}} },
      // { input: formattedInputMessages },
      // { output: outputMessage },
      {
        datasetId: dataset.id,
      }
    );
  }
}

run();