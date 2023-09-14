import "./globals.css";
import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>LangChain Python to JS Translator Bot</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="Translate LangChain Python modules to JS! See https://github.com/jacoblee93/langchain-translator for source code and more info."
        />
        <meta
          property="og:title"
          content="LangChain Python to JS Module Translator"
        />
        <meta
          property="og:description"
          content="Translate LangChain Python modules to JS! See https://github.com/jacoblee93/langchain-translator for source code and more info."
        />
        <meta property="og:image" content="/images/og_image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="LangChain Python to JS Module Translator"
        />
        <meta
          name="twitter:description"
          content="Translate LangChain Python modules to JS! See https://github.com/jacoblee93/langchain-translator for source code and more info."
        />
        <meta name="twitter:image" content="/images/og_image.png" />
      </head>
      <body className={publicSans.className}>
        <div className="flex flex-col p-4 md:p-12 h-[100vh]">{children}</div>
      </body>
    </html>
  );
}
