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
    <div className="code-block-wrapper border-base-300 my-4 overflow-hidden rounded-lg border">
      {/* Header with filename and copy button */}
      <div className="bg-base-200 border-base-300 flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-base-content/70 font-mono text-sm">
              {filename}
            </span>
          )}
          {!filename && language && (
            <span className="text-base-content/60 font-mono text-xs uppercase">
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
      <div className="bg-base-100 relative overflow-x-auto">
        <pre className="m-0 p-4">
          <code className="font-mono text-sm">
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightLines.includes(lineNumber);

              return (
                <div
                  key={index}
                  className={`min-h-[1.5rem] ${
                    isHighlighted
                      ? "bg-primary/10 border-primary -ml-2 border-l-4 pl-2"
                      : ""
                  }`}
                >
                  {showLineNumbers && (
                    <span className="text-base-content/40 mr-4 inline-block w-8 text-right select-none">
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
