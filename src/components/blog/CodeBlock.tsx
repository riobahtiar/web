import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  highlightLines = [],
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const lines = code.split("\n");

  return (
    <div className="code-block-wrapper my-4 rounded-lg overflow-hidden border border-base-300">
      {/* Header with filename and copy button */}
      <div className="flex items-center justify-between bg-base-200 px-4 py-2 border-b border-base-300">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-sm font-mono text-base-content/70">
              {filename}
            </span>
          )}
          {!filename && language && (
            <span className="text-xs font-mono text-base-content/60 uppercase">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="btn btn-ghost btn-xs gap-1"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="relative overflow-x-auto bg-base-100">
        <pre className="p-4 m-0">
          <code className="font-mono text-sm">
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightLines.includes(lineNumber);

              return (
                <div
                  key={index}
                  className={`min-h-[1.5rem] ${
                    isHighlighted
                      ? "bg-primary/10 border-l-4 border-primary pl-2 -ml-2"
                      : ""
                  }`}
                >
                  {showLineNumbers && (
                    <span className="inline-block w-8 text-right text-base-content/40 select-none mr-4">
                      {lineNumber}
                    </span>
                  )}
                  <span>{line || " "}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;
