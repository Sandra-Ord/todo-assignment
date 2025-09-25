export type TaskAction = "create" | "complete" | "delete" | "edit" | null;

export type TaskSortBy = "dueAt" | "completedAt" | "createdAt";

export type TaskFilterValues = boolean | string;