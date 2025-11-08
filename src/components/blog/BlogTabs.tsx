import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Tab {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface BlogTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  className?: string;
}

export function BlogTabs({ tabs, defaultValue, className }: BlogTabsProps) {
  const defaultTab = defaultValue || tabs[0]?.value;

  return (
    <div className={`my-8 ${className || ""}`}>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full justify-start mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="prose prose-sm max-w-none"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Simple wrapper for code comparison tabs
interface CodeTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

export function CodeTabs({ children, defaultValue }: CodeTabsProps) {
  return (
    <div className="my-8">
      <Tabs defaultValue={defaultValue} className="w-full">
        {children}
      </Tabs>
    </div>
  );
}

// Export individual components for flexible usage
export { TabsList, TabsTrigger, TabsContent };
