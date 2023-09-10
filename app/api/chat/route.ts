import { NextRequest, NextResponse } from "next/server";
import { ChatWindowMessage } from "@/schema/ChatWindowMessage";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { ChatPromptTemplate } from "langchain/prompts";

import * as hub from "langchain/hub";

export const runtime = "edge";

const formatMessage = (message: ChatWindowMessage) => {
  let prefix;
  if (message.role === "human") {
    prefix = "Human:";
  } else {
    prefix = "Assistant:";
  }
  return `${prefix} ${message.content}`;
};

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = messages.length === 1
      ? await hub.pull("jacob/langchain-python-to-js")
      : await hub.pull("jacob/langchain-python-to-js-follow-up");

    /**
     * Custom fine-tuned model trained from the dataset in "upload_initial_dataset.ts".
     * For best results, keep temperature low.
     */
    const model = new ChatOpenAI({
      temperature: 0,
      modelName: process.env.OPENAI_FINE_TUNED_MODEL_NAME
    });

    /**
     * This output parser converts streaming output chunks into the correct format.
     */
    const outputParser = new BytesOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "langchain/schema/runnable";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    const chainParams = messages.length === 1 ? {
      code: currentMessageContent,
    } : {
      chat_history: formattedPreviousMessages.join("\n"),
      question: currentMessageContent,
    }
    /**
     * Wait for a run id to be generated.
     */
    let chainRunId;
    const stream: ReadableStream = await new Promise((resolve) => {
      const chainStream = chain.stream(
        chainParams,
        {
          callbacks: [
            {
              handleChainStart(_llm, _prompts, runId) {
                chainRunId = runId;
                resolve(chainStream);
              },
            },
          ],
        },
      );
    });

    return new Response(stream, {
      headers: {
        "x-langsmith-run-id": chainRunId ?? "",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}