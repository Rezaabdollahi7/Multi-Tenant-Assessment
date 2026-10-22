import type { components } from "./schema";

type Schemas = components["schemas"];

export type CurrentUser = Schemas["CurrentUserDto"];
export type Permission = Schemas["Permission"];
export type Role = Schemas["Role"];

export type Project = Schemas["ProjectDto"];
export type ProjectDetail = Schemas["ProjectDetailDto"];
export type ProjectList = Schemas["ProjectListDto"];
export type ProjectStatus = Schemas["ProjectStatus"];
export type Member = Schemas["MemberDto"];

export type Finding = Schemas["FindingDto"];
export type FindingList = Schemas["FindingListDto"];
export type FindingSeverity = Schemas["FindingSeverity"];
export type FindingStatus = Schemas["FindingStatus"];
export type CreateFindingInput = Schemas["CreateFindingDto"];
export type UpdateFindingInput = Schemas["UpdateFindingDto"];

export type DashboardSummary = Schemas["DashboardSummaryDto"];
export type TrendPoint = Schemas["TrendPointDto"];
export type Activity = Schemas["ActivityDto"];

export type PaginationMeta = Schemas["PaginationMetaDto"];
