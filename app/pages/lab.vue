<script setup lang="ts">
import type { VueUiStacklineDatasetItem } from "vue-data-ui/vue-ui-stackline";

// NOTE: The data treatment is identical to the one on /health
// Eventually, we can just move the heatmaps there ?
// If not, we'll make a composable to centralize data computation
const { data } = useEcosystemHealth();

definePageMeta({
  layout: "default",
});

const rootEl = shallowRef<HTMLElement | null>(null);
const colors = useColors(rootEl);

function createChartDataset(source?: EcosystemHealthItem[]): {
  categories: string[];
  dataset: VueUiStacklineDatasetItem[];
} {
  if (!source?.length) {
    return {
      categories: [],
      dataset: [
        {
          name: "Organic",
          series: [],
          color: colors.value.greenLine,
        },
        {
          name: "Mixed",
          series: [],
          color: colors.value.amber,
        },
        {
          name: "Automation",
          series: [],
          color: colors.value.dangerHover,
        },
      ],
    };
  }

  const categories = [...new Set(source.map((item) => item.created_at))].sort();

  const sumsByDate: Record<
    string,
    {
      automation: number;
      mixed: number;
      organic: number;
    }
  > = {};

  categories.forEach((date) => {
    sumsByDate[date] = {
      automation: 0,
      mixed: 0,
      organic: 0,
    };
  });

  source.forEach((item) => {
    const dateSums = sumsByDate[item.created_at];

    if (!dateSums) return;

    if (item.score <= 50) {
      dateSums.automation += 1;
    } else if (item.score <= 70) {
      dateSums.mixed += 1;
    } else {
      dateSums.organic += 1;
    }
  });

  return {
    categories,
    dataset: [
      {
        name: "Organic",
        series: categories.map((date) => sumsByDate[date]?.organic ?? 0),
        color: colors.value.greenLine,
      },
      {
        name: "Mixed",
        series: categories.map((date) => sumsByDate[date]?.mixed ?? 0),
        color: colors.value.amber,
      },
      {
        name: "Automation",
        series: categories.map((date) => sumsByDate[date]?.automation ?? 0),
        color: colors.value.dangerHover,
      },
    ],
  };
}

const stacklineData = computed(() => createChartDataset(data.value));

const dataset = computed(() => stacklineData.value.dataset);

const timestamps = computed(() => {
  if (!data.value?.length) return [];

  return [...new Set(data.value.map((item) => item.created_at))].sort();
});
</script>

<template>
  <section class="flex flex-col gap-6 h-full">
    <div class="h-full flex flex-col items-center justify-center w-full">
      <header class="text-center">
        <h1 class="text-2xl font-semibold">The Lab</h1>
        <p class="text-gh-muted mt-1 mb-8">Sh*t can be broken here.</p>
        <div
          class="mt-4 p-4 bg-gh-card border-1 border-solid border-gh-border rounded-2 text-center"
        >
          <div
            aria-hidden="true"
            class="flex gap-2 items-center justify-center text-xl text-gh-text/60 mb-2"
          >
            <span class="i-lucide:flask-conical"></span>
            <span class="i-lucide:skull"></span>
            <span class="i-lucide:triangle-alert"></span>
          </div>
          <p class="text-sm text-gh-text leading-relaxed">
            This page is a sandbox where we test new ideas and features. Things
            here may break, data might be inaccurate, or features could
            disappear entirely. Take everything on this page with a grain of
            salt and treat it as early-stage exploration, not production-ready
            tools.
          </p>
        </div>
      </header>
    </div>

    <div
      class="flex flex-col gap-20 items-center justify-center pb-12 w-full px-4 mt-24"
    >
      <div>
        <ChartHealthResponseSparklines />
      </div>
      <div class="w-full">
        <ChartFeaturedPackageHealthRanking />
      </div>
      <div class="w-full">
        <ChartGlobalEventsHeatmap :data="dataset" :timestamps />
      </div>
      <div class="w-full">
        <h2 class="text-xl font-semibold mb-4">Scan Results by User ID</h2>
        <AnalysisScanListTable />
      </div>
    </div>
  </section>
</template>
