import { libraries } from "~~/shared/daily-scan";

export type VerifiedAutomation = {
  username: string;
  id?: number;
  reason: string;
  issueUrl: string;
  createdAt: string;
};

export type DetectedAutomationResponse = {
  username: string;
  created_at: string;
  user_id: number;
  score: number;
  pr_number: number;
  pr_status: string;
  user_created_at: string;
  user_public_repos_count: number;
  events_count: number;
  repo_name: (typeof libraries)[number];
};

export type DetectedAutomation = {
  username: string;
  userId: number;
  score: number;
  totalPrs: number;
  firstDetected: string;
  lastDetected?: string;
};
