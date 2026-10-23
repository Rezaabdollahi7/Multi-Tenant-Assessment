import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { firaCode, firaSans } from "../src/app/fonts";
import "../src/app/globals.css";

// Portalled content (menus, dialogs) renders in <body>, so the fonts go there.
document.body.classList.add(
  firaSans.variable,
  firaCode.variable,
  "antialiased",
);

/** Applies the theme chosen in the toolbar the way next-themes does in the app. */
const withTheme: Decorator = (Story, context) => {
  const dark = context.globals.theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Colour theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: { appDirectory: true },
    // Accessibility violations fail the story's test, not just warn in the panel.
    a11y: { test: "error" },
  },
  tags: ["autodocs"],
};

export default preview;
