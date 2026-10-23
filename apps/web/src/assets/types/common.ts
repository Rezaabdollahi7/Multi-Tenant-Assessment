export type Option<Value extends string = string> = {
  value: Value;
  label: string;
};

export type StatusTone = "neutral" | "active" | "positive" | "inactive";
