import { describe, expect, it } from "vitest";
import en from "./messages/en.json";
import fa from "./messages/fa.json";

function keyPaths(messages: object, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? keyPaths(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe("messages", () => {
  it("translate every English key into Persian, and nothing more", () => {
    expect(keyPaths(fa).sort()).toEqual(keyPaths(en).sort());
  });
});
