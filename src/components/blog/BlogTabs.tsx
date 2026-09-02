import type { JSX } from "solid-js";

import { For } from "solid-js";

import { CodeBlock } from "@/components/blog/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  label: string;
  value: string;
  content: JSX.Element;
}

interface CodeTab {
  label: string;
  /** Defaults to a slug of the label. */
  value?: string;
  code: string;
  language?: string;
  filename?: string;
}

interface BlogTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  class?: string;
}

export function BlogTabs(props: BlogTabsProps) {
  const defaultTab = () => props.defaultValue ?? props.tabs[0]?.value;

  return (
    <div class={`my-8 ${props.class ?? ""}`}>
      <Tabs defaultValue={defaultTab()} class="w-full">
        <TabsList>
          <For each={props.tabs}>
            {(tab) => <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>}
          </For>
        </TabsList>
        <For each={props.tabs}>
          {(tab) => (
            <TabsContent value={tab.value} class="prose prose-sm max-w-none">
              {tab.content}
            </TabsContent>
          )}
        </For>
      </Tabs>
    </div>
  );
}

/**
 * Tabbed code samples for MDX.
 *
 * Takes the tabs as a prop rather than as children on purpose. Astro renders a
 * component's slotted children outside the island, so nested <TabsTrigger> /
 * <TabsContent> could never reach the Tabs context and the group rendered
 * empty. Serializable props keep the whole group inside one island.
 */
export function CodeTabs(props: { tabs: CodeTab[]; defaultValue?: string }) {
  const valueOf = (tab: CodeTab) =>
    tab.value ?? tab.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const defaultTab = () => props.defaultValue ?? valueOf(props.tabs[0]!);

  return (
    <div class="my-8">
      <Tabs defaultValue={defaultTab()} class="w-full">
        <TabsList>
          <For each={props.tabs}>
            {(tab) => (
              <TabsTrigger value={valueOf(tab)}>{tab.label}</TabsTrigger>
            )}
          </For>
        </TabsList>
        <For each={props.tabs}>
          {(tab) => (
            <TabsContent value={valueOf(tab)}>
              <CodeBlock
                code={tab.code}
                language={tab.language}
                filename={tab.filename}
              />
            </TabsContent>
          )}
        </For>
      </Tabs>
    </div>
  );
}
