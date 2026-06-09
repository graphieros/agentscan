import type { DetectedAutomation } from "~~/shared/types/automation";

export function useDetectedAutomations() {
  return useLazyAsyncData(
    "detected-automations",
    async () => {
      return $fetch<DetectedAutomation[]>("/api/detected-automations");
    },
    {
      transform: (data) => {
        return data.sort((a, b) => {
          return b.totalPrs - a.totalPrs;
        });
      },
    },
  );
}
