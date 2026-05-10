<script setup lang="ts">
import type { IdentityClassification } from "@unveil/identity";

const { data, status, error } = useScan();

definePageMeta({
  layout: false,
});

useHead({
  title: "Ecosystem health | AgentScan",
  meta: [
    {
      name: "description",
      content:
        "Track GitHub ecosystem health with daily analysis of 100 unique accounts from trending repositories. Monitor automation, mixed, and organic activity patterns over time to understand ecosystem trends.",
    },
    { property: "og:title", content: "Ecosystem health | AgentScan" },
    {
      property: "og:description",
      content:
        "Track GitHub ecosystem health with daily analysis of unique accounts from trending repositories. Monitor automation, mixed, and organic activity patterns over time to understand ecosystem trends.",
    },
    { property: "og:type", content: "website" },
  ],
});

function classifyByScore(score: number): IdentityClassification {
  if (score <= 50) return "automation";
  if (score <= 70) return "mixed";
  return "organic";
}

type ClassificationStats = Record<
  IdentityClassification,
  { count: number; percentage: string }
>;

type ClassificationConfig = {
  key: IdentityClassification;
  label: string;
  bgColor: string;
};

const classificationConfigs: ClassificationConfig[] = [
  { key: "organic", label: "Organic", bgColor: "bg-green-500" },
  { key: "mixed", label: "Mixed", bgColor: "bg-amber-500" },
  { key: "automation", label: "Automation", bgColor: "bg-orange-500" },
];

const latestDayStats = computed<ClassificationStats | null>(() => {
  if (!data.value?.length) return null;

  const totalCount = data.value.length;

  const counts: Record<IdentityClassification, number> = {
    organic: 0,
    mixed: 0,
    automation: 0,
  };

  data.value.forEach((item) => {
    const classification = classifyByScore(item.score);
    counts[classification]++;
  });

  return {
    organic: {
      count: counts.organic,
      percentage: ((counts.organic / totalCount) * 100).toFixed(2),
    },
    mixed: {
      count: counts.mixed,
      percentage: ((counts.mixed / totalCount) * 100).toFixed(2),
    },
    automation: {
      count: counts.automation,
      percentage: ((counts.automation / totalCount) * 100).toFixed(2),
    },
  };
});
</script>

<template>
  <div class="flex flex-col gap-6 h-svh">
    <header class="text-center md:text-left mx-auto max-w-xl p-8">
      <h1 class="text-2xl font-semibold">Ecosystem health</h1>
      <div class="text-gh-muted mt-2 flex flex-col gap-2">
        <p>
          A snapshot of GitHub community activity patterns. We analyze 100
          unique accounts daily from trending repositories, classifying them as
          organic, mixed, or automated to gauge the overall ecosystem health.
        </p>
      </div>
    </header>
    <ul class="flex gap-4 mx-auto text-sm">
      <li
        v-for="config in classificationConfigs"
        :key="config.key"
        class="flex gap-2 items-center"
      >
        <span :class="`size-2 ${config.bgColor} block rounded-full`"></span>
        <p>
          {{ config.label }}
          <span class="text-gh-muted">
            {{ latestDayStats?.[config.key].percentage }}% ({{
              latestDayStats?.[config.key].count
            }})
          </span>
        </p>
      </li>
    </ul>
    <div class="h-full max-h-[300px] sm:max-h-[500px]">
      <ChartGlobalStatusDashboard :data />
    </div>
  </div>
  <MainFooter />
</template>
