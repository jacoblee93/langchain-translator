import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  const InfoCard = (
    <div className="flex flex-col p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="ml-auto mr-auto text-3xl md:text-4xl mb-4">
        🐍 LangChain Python to JS Module Translator ☕
      </h1>
      <ul>
        <li className="text-l">
          🔄
          <span className="ml-2">
            This chatbot converts Python LangChain modules to{" "}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>
            .
          </span>
        </li>
        <li className="text-l">
          🎹
          <span className="ml-2">
            It&apos;s powered by an OpenAI <code>gpt-3.5-turbo</code> model
            fine-tuned on various parallel LangChain Python and JS modules.
          </span>
        </li>
        <li className="text-l">
          🧠
          <span className="ml-2">
            This enables it to innately {`"know"`} about style, dependencies,
            and other details specific to LangChain.js, theoretically resulting
            in higher quality code.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🏘️
          <span className="ml-2">
            It&apos;s meant to be a starting point for contributors and others
            in the community who want to use LangChain Python features in JS!
          </span>
        </li>
        <li className="text-l">
          👍
          <span className="ml-2">
            Remember to thumbs up or down! The feedback curates the{" "}
            <a href="https://smith.langchain.com" target="_blank">
              LangSmith
            </a>{" "}
            dataset behind the model, allowing for further fine-tuning.
          </span>
        </li>
        <li className="text-l">
          🐙
          <span className="ml-2">
            The initial training dataset, motivation, and guides on creating your own LangSmith datasets are available{" "}
            <a href="https://github.com/jacoblee93/langchain-translator">
              on GitHub
            </a>
            .
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Go to{" "}
            <a
              href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain"
              target="_blank"
            >
              the LangChain Python repo
            </a>
            , pick your favorite module, and paste some Python code below!
          </span>
        </li>
      </ul>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat"
      emoji="🦜"
      titleText="LangChain Python to JS Translator"
      placeholder="Paste some Python code from a LangChain module..."
      emptyStateComponent={InfoCard}
    ></ChatWindow>
  );
}
