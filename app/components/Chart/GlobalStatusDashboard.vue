<script setup lang="ts">
import { type VueUiStacklineDatasetItem } from "vue-data-ui/vue-ui-stackline";
import { useColors } from "~/composables/useColors";
import { useElementSize } from "@vueuse/core";

const props = defineProps<{
  data: Scan[] | undefined;
}>();

const rootEl = shallowRef<HTMLElement | null>(null);
const chartContainer = useTemplateRef<HTMLElement>("chartContainer");

onMounted(async () => {
  rootEl.value = document.documentElement;
});

const colors = useColors(rootEl);

function createStacklineDataset(source: Scan[] = []): {
  categories: string[];
  dataset: VueUiStacklineDatasetItem[];
} {
  const categories = [...new Set(source.map((item) => item.created_at))].sort();

  const sumsByDate: Record<
    string,
    {
      autiomation: number;
      mixed: number;
      organic: number;
    }
  > = {};

  categories.forEach((date) => {
    sumsByDate[date] = {
      autiomation: 0,
      mixed: 0,
      organic: 0,
    };
  });

  source.forEach((item) => {
    const dateSums = sumsByDate[item.created_at];

    if (!dateSums) return;

    if (item.score <= 50) {
      dateSums.autiomation += 1;
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
        name: "autiomation",
        series: categories.map((date) => sumsByDate[date]?.autiomation ?? 0),
        color: colors.value.red,
      },
      {
        name: "mixed",
        series: categories.map((date) => sumsByDate[date]?.mixed ?? 0),
        color: colors.value.dangerHover,
      },
      {
        name: "organic",
        series: categories.map((date) => sumsByDate[date]?.organic ?? 0),
        color: colors.value.green,
      },
    ],
  };
}

const stacklineData = computed(() => createStacklineDataset(props.data ?? []));
const dataset = computed(() => stacklineData.value.dataset);

const timestamps = computed(() => {
  if (!props.data?.length) return [];

  return [...new Set(props.data.map((item) => item.created_at))].sort();
});

const selectedIndex = shallowRef<number | undefined>(undefined);

function setSelectedIndex(
  payload:
    | number
    | { index?: number; selectedIndex?: number; seriesIndex?: number }
    | undefined
    | null,
) {
  if (typeof payload === "number") {
    selectedIndex.value = payload;
    return;
  }

  selectedIndex.value = payload?.index ?? payload?.selectedIndex ?? undefined;
}

const { width, height } = useElementSize(chartContainer);
</script>

<template>
  <div class="relative w-full">
    <div class="max-w-[450px] mx-auto mb-12">
      <ChartGlobalEventsBreakdown :data="dataset" />
    </div>

    <ChartGlobalEventsSplitSparklines
      :dataset
      :dates="timestamps"
      :selectedXIndex="selectedIndex"
      @selectIndex="setSelectedIndex"
    />
  </div>
  <div
    class="absolute bottom-0 h-1/2 no-chart-transition"
    ref="chartContainer"
    :style="{
      left: '-8%',
      width: 'calc(100% + 16%)',
    }"
  >
    <ChartGlobalEventsEvolution :data="dataset" :timestamps :width :height />
  </div>
</template>

<style>
.no-chart-transition path,
circle {
  transition: none !important;
  animation: none !important;
}
</style>
