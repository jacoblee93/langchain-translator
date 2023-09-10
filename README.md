# 🐍 LangChain Python to JS Module Translator ☕

This repo contains a chat bot around an OpenAI model fine-tuned to convert LangChain Python code to LangChain.js.
It's intended to help LangChain.js contributors more easily port over analogous Python features by automatically
generating starter code and docstrings.

Try it out here: https://langchain-translator.vercel.app/

![Example chat output with feedback buttons](/public/images/output.png)

Remember to leave feedback using the thumbs up and down buttons! It will help us further refine the
[LangSmith dataset](https://smith.langchain.com/) and enable even better fine-tuned models in the future.

## 🎹 Why Fine-Tuning?

GPT-4 is generally very good at rewriting and translating code. However, I periodically ran into a few issues:

1. Hallucination/misuse of imports
  - Some Python classes are named differently and have slightly different interfaces (named args vs. options objects)
    - Could maybe have come up with a few-shotting/RAG pipeline like previous work on [automatically generating docstrings](https://github.com/jacoblee93/auto-docstrings) but seemed more difficult to encapsulate usage information as well as summaries
  - Idea was that fine-tuning could innately capture some of the context around imports
2. Encapsulating code style (camel case, linter issues, etc.)
  - Example with gpt-4: https://smith.langchain.com/public/14c1e391-2cf5-4a3d-8c9f-15929a69c08d/r
      - Not bad but it uses snake case, doesn’t include a constructor, and doesn’t have a docstring for the class
  - Fine-tuned 3.5 on the same input: https://smith.langchain.com/public/900e7b36-5994-4a10-8ca7-fa3f74a62c8d/r

Additionally, OpenAI has plans to make [fine-tuning GPT-4 available in the future](https://platform.openai.com/docs/guides/fine-tuning/what-models-can-be-fine-tuned). By starting to gather and evaluate a dataset now, we can reuse it for fine-tuning future models.

## 🧪 Methodology

### Gathering the Dataset

The most difficult part of the project was gathering the initial dataset.
While we fortunately have tried to keep the LangChain Python and JS repos in sync,
it was quite tedious to go through both repos and look for parallel examples.

After going through about 6 myself, I ended up hiring someone on Upwork (thanks [@jxnlco](https://twitter.com/jxnlco) for the tip!)
and after a few days, had a dataset of 72 parallel examples. You can see the initial dataset used here under `dataset/training`.

### Formatting the Dataset and Uploading to LangSmith

I had decent results with just uploading raw Python and JS code examples to OpenAI, but had some issues with output formatting
for the chat interface. I therefore decided to format the examples using the exact prompt I was going to use, which
I've uploaded it to the LangChain Hub here: https://smith.langchain.com/hub/jacob/langchain-python-to-js

I formatted the raw code examples with the above LangChain prompt, then ran the script under `scripts/upload_initial_dataset.ts`
to create a dataset and upload the formatted examples to [LangSmith](https://smith.langchain.com) for safekeeping/potential
future analysis.

### Exporting and Uploading to OpenAI

I went to the newly created dataset in LangSmith and exported it in the `OpenAI Fine-Tuning JSONL` format:

![Export the dataset](/public/images/export-dataset.png)
![Download the dataset in the correct format](/public/images/download-dataset.png)

Then I used [@jxnlco's Instructor CLI](https://jxnl.github.io/instructor/cli/finetune/) to fine-tune a model from the downloaded
file. The process took a few minutes, but at the end of it I had my own fine-tuned `gpt-3.5-turbo` model!

## 📄 Results

While the model isn't perfect and does still hallucinate sometimes, there are some pretty quality responses that have personally saved me time:

https://smith.langchain.com/public/3a18b910-90e2-48b9-a69e-b01d10032181/r
https://smith.langchain.com/public/900e7b36-5994-4a10-8ca7-fa3f74a62c8d/r

All in all I think fine-tuning on OpenAI has potential - more comparison vs. standard `gpt-4` is needed,
but it’s definitely better than stock `gpt-3.5-turbo`, and seems comparable in many cases.

I'm very excited to be able to fine-tune `gpt-4` and to keep adding to the dataset!

## Thank You!

Thanks for reading! If you have any questions or comments, reach out me [@Hacubu](https://x.com/hacubu)
or [@LangChainAI](https://x.com/langchainai) on X (formerly Twitter).

Thank you also to [@jxnlco](https://twitter.com/jxnlco) for your tips and tricks!
