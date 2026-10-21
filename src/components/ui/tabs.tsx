import type { ComponentProps, ParentProps } from "solid-js";

import { Tabs as KobalteTabs } from "@kobalte/core/tabs";
import { splitProps } from "solid-js";

import { cn } from "@/lib/utils";

/**
 * Accessible tabs built on Kobalte, Solid's equivalent of Radix. Keyboard
 * navigation and the aria wiring come from the primitive.
 */
export function Tabs(props: ComponentProps<typeof KobalteTabs>) {
  return <KobalteTabs {...props} />;
}

export function TabsList(
  props: ParentProps<ComponentProps<typeof KobalteTabs.List>>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <KobalteTabs.List
      class={cn(
        "border-border relative flex items-center gap-1 border-b",
        local.class,
      )}
      {...rest}
    >
      {local.children}
      <KobalteTabs.Indicator class="bg-accent-solid absolute bottom-0 h-px transition-all duration-200" />
    </KobalteTabs.List>
  );
}

export function TabsTrigger(
  props: ParentProps<ComponentProps<typeof KobalteTabs.Trigger>>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <KobalteTabs.Trigger
      class={cn(
        "text-muted-foreground hover:text-foreground -mb-px inline-flex h-9 items-center px-3 text-sm font-medium transition-colors outline-none",
        "ui-selected:text-foreground focus-visible:ring-ring focus-visible:ring-2",
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </KobalteTabs.Trigger>
  );
}

export function TabsContent(
  props: ParentProps<ComponentProps<typeof KobalteTabs.Content>>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <KobalteTabs.Content class={cn("pt-4 outline-none", local.class)} {...rest}>
      {local.children}
    </KobalteTabs.Content>
  );
}
