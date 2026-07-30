export type Federation = {
  id: string;
  name: string;
  status: "operational" | "degraded" | "critical";
  members: number;
  policies: string[];
  createdAt: string;
};

export type Policy = {
  id: string;
  key: string;
  description: string;
  rules: Record<string, unknown>;
  version: string;
  createdAt: string;
};

export type RFC = {
  id: string;
  title: string;
  author: string;
  status: "draft" | "review" | "accepted" | "implemented";
  summary: string;
  createdAt: string;
};
