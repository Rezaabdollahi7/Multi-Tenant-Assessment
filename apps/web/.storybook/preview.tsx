import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { MotionConfig } from "motion/react";
import { Direction } from "radix-ui";
import { dana } from "../src/assets/fonts";
import "../src/app/globals.css";

document.body.classList.add(dana.variable, "antialiased");

const withTheme: Decorator = (Story, context) => {
  const dark = context.globals.theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  return <Story />;
};

const withDirection: Decorator = (Story, context) => {
  const inDocs = context.viewMode === "docs";
  document.documentElement.lang = inDocs ? "en" : "fa";
  document.documentElement.dir = inDocs ? "ltr" : "rtl";
  return (
    <Direction.Provider dir="rtl">
      <MotionConfig reducedMotion="user">
        <div
          lang="fa"
          dir="rtl"
          className={
            inDocs ? "rounded-xl bg-background p-6 text-foreground" : undefined
          }
        >
          <Story />
        </div>
      </MotionConfig>
    </Direction.Provider>
  );
};

const preview: Preview = {
  decorators: [withTheme, withDirection],
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
    a11y: { test: "error" },
  },
  tags: ["autodocs"],
};

export default preview;
