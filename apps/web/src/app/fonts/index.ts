import localFont from "next/font/local";

/**
 * Dana, for Persian and Latin alike, self-hosted so neither the build nor the
 * Docker image needs network access for it. Commercial font by fontiran.com;
 * used under the project owner's licence.
 */
export const dana = localFont({
  src: [
    { path: "./dana/Dana-UltraLight.woff2", weight: "200", style: "normal" },
    { path: "./dana/Dana-Light.woff2", weight: "300", style: "normal" },
    { path: "./dana/Dana-Regular.woff2", weight: "400", style: "normal" },
    { path: "./dana/Dana-Medium.woff2", weight: "500", style: "normal" },
    { path: "./dana/Dana-DemiBold.woff2", weight: "600", style: "normal" },
    { path: "./dana/Dana-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-dana",
  display: "swap",
});
