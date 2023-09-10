import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

import * as hub from "langchain/hub";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";

const SYSTEM_PROMPT_TEMPLATE = `You are a highly experienced developer working on LangChain, an open source framework that helps developers build applications with large language models (LLMs).

LangChain contains abstractions and integrations for working with LLMs, chat models, vector databases, autonomous agents, and more.

It has two versions: Python and TypeScript. You are well-versed in both languages, and help keep both versions in sync.`;

const HUMAN_PROMPT_TEMPLATE = `Convert the Python code in the following markdown code block into TypeScript. Pay particular attention to style, and try to use imports correctly. Render all output code between "\`\`\`typescript" markdown code blocks:

\`\`\`python
{code}
\`\`\``;

const FOLLOWUP_HUMAN_TEMPLATE = `Your job is to answer questions about and rewrite the translated TypeScript in the following conversation:

{chat_history}

Answer the below question as best you can. Respond with updated code directly if asked a question asking to change something about previously translated TypeScript code.
Pay particular attention to code style, and try to use imports correctly. Render all output code between "\`\`\`typescript" markdown code blocks.

{question}`;

async function run() {
  try {
    const languageConversionPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT_TEMPLATE),
      HumanMessagePromptTemplate.fromTemplate(HUMAN_PROMPT_TEMPLATE),
    ]);
    console.log(await hub.push("jacob/langchain-python-to-js", languageConversionPrompt));
  } catch (e) {
    console.log(e);
  }
  try {
    const translationFollowupPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT_TEMPLATE),
      HumanMessagePromptTemplate.fromTemplate(FOLLOWUP_HUMAN_TEMPLATE),
    ]);
    console.log(await hub.push("jacob/langchain-python-to-js-follow-up", translationFollowupPrompt));
  } catch (e) {
    console.log(e);
  }
}

run();
