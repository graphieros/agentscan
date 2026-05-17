import type { EcosystemHealthItem } from "~~/shared/types/ecosystem-health";

export function useEcosystemHealth() {
  return useLazyAsyncData("ecosystem-health", async () => {
    return $fetch<EcosystemHealthItem[]>("/api/health");
  });
}
