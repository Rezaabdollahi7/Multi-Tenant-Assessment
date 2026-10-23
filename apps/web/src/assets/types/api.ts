import type { components } from "./api-schema";

export type Schemas = components["schemas"];

export type PaginationMeta = Schemas["PaginationMetaDto"];

export type ApiErrorBody = {
  statusCode?: number;
  message?: string;
  errors?: Record<string, string[]>;
};
