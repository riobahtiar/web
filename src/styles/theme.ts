// Theme configuration
export const theme = {
  // Layout
  layout: {
    container: "container mx-auto px-4",
    section: "py-8 md:py-12 lg:py-16",
    hero: "min-h-screen",
  },

  // Components
  components: {
    // Card variations
    card: {
      primary: "card bg-primary text-primary-content shadow-xl",
      secondary: "card bg-secondary text-secondary-content shadow-xl",
      neutral: "card bg-neutral text-neutral-content shadow-xl",
      base: "card bg-base-100 shadow-xl",
    },

    // Button variations
    button: {
      primary: "btn btn-primary",
      secondary: "btn btn-secondary",
      accent: "btn btn-accent",
      ghost: "btn btn-ghost",
      link: "btn btn-link",
      outline: {
        primary: "btn btn-outline btn-primary",
        secondary: "btn btn-outline btn-secondary",
        accent: "btn btn-outline btn-accent",
      },
      sizes: {
        sm: "btn-sm",
        md: "btn-md",
        lg: "btn-lg",
      },
    },

    // Badge variations
    badge: {
      primary: "badge badge-primary",
      secondary: "badge badge-secondary",
      accent: "badge badge-accent",
      neutral: "badge badge-neutral",
      ghost: "badge badge-ghost",
      outline: "badge badge-outline",
      sizes: {
        sm: "badge-sm",
        md: "badge-md",
        lg: "badge-lg",
      },
    },

    // Avatar
    avatar: {
      primary: "avatar ring ring-primary ring-offset-base-100 ring-offset-2",
      sizes: {
        sm: "w-16",
        md: "w-24",
        lg: "w-32",
      },
    },
  },

  // Typography
  typography: {
    title: {
      primary: "text-5xl font-bold text-primary",
      base: "text-5xl font-bold",
    },
    subtitle: {
      primary: "text-xl text-primary opacity-90",
      base: "text-xl opacity-90",
    },
    section: {
      title: "text-3xl font-bold text-center",
      subtitle: "text-xl text-center opacity-90",
    },
  },

  // Effects
  effects: {
    hover: {
      scale: "hover:scale-105 transition-transform duration-300",
      opacity: "hover:opacity-90 transition-opacity duration-300",
    },
    transition: {
      base: "transition-all duration-300",
      slow: "transition-all duration-500",
      fast: "transition-all duration-150",
    },
  },

  // Backgrounds
  backgrounds: {
    gradient: {
      primary: "bg-gradient-to-r from-primary to-primary-focus",
      secondary: "bg-gradient-to-r from-secondary to-secondary-focus",
    },
    pattern: {
      dots: "bg-base-200 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]",
    },
  },
};

// Helper function to combine classes
export const cx = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};
