import { Check, Copy } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
}

export function CodeBlock(props: CodeBlockProps) {
  const [copied, setCopied] = createSignal(false);

  const lines = () => props.code.split("\n");
  const isHighlighted = (n: number) => props.highlightLines?.includes(n);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div class="border-border my-6 overflow-hidden rounded-xl border">
      <div class="border-border bg-surface-2 flex items-center justify-between border-b px-4 py-2">
        <span class="text-subtle-foreground font-mono text-xs">
          {props.filename ?? props.language ?? "code"}
        </span>
        <button
          type="button"
          onClick={copyToClipboard}
          class="text-muted-foreground hover:text-foreground hover:bg-surface-hover inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs transition-colors"
          aria-label={copied() ? "Copied" : "Copy code"}
        >
          <Show when={copied()} fallback={<Copy class="h-3 w-3" />}>
            <Check class="text-accent h-3 w-3" />
          </Show>
          {copied() ? "Copied" : "Copy"}
        </button>
      </div>

      <div class="bg-surface overflow-x-auto">
        <pre class="m-0 p-4">
          <code class="font-mono text-[13px] leading-relaxed">
            <For each={lines()}>
              {(line, index) => (
                <div
                  class={
                    isHighlighted(index() + 1)
                      ? "bg-accent-wash border-accent-solid -ml-4 border-l-2 pl-[calc(1rem-2px)]"
                      : undefined
                  }
                >
                  <Show when={props.showLineNumbers}>
                    <span class="text-subtle-foreground mr-4 inline-block w-8 text-right select-none">
                      {index() + 1}
                    </span>
                  </Show>
                  <span>{line || " "}</span>
                </div>
              )}
            </For>
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;
