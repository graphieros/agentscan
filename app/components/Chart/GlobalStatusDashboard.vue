<script setup lang="ts">
import {
  VueUiStackline,
  type VueUiStacklineDatasetItem,
  type VueUiStacklineConfig,
} from "vue-data-ui/vue-ui-stackline";
import { useChartTooltipPosition } from "~/composables/useChartTooltipPosition";
import { useColors } from "~/composables/useColors";

const props = defineProps<{
  data: Scan[] | undefined;
}>();

const rootEl = shallowRef<HTMLElement | null>(null);
const chartRef = useTemplateRef("chartRef");

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
      automated: number;
      mixed: number;
      organic: number;
    }
  > = {};

  categories.forEach((date) => {
    sumsByDate[date] = {
      automated: 0,
      mixed: 0,
      organic: 0,
    };
  });

  source.forEach((item) => {
    const dateSums = sumsByDate[item.created_at];

    if (!dateSums) return;

    if (item.score <= 50) {
      dateSums.automated += 1;
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
        name: "automated",
        series: categories.map((date) => sumsByDate[date]?.automated ?? 0),
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

// true: show as percentages
const isDistributed = shallowRef(false);

const tooltipPosition = useChartTooltipPosition(chartRef);

const config = computed<VueUiStacklineConfig>(() => {
  return {
    userOptions: { show: false },
    style: {
      chart: {
        backgroundColor: "transparent",
        height: 255,
        grid: {
          stroke: colors.value.border,
          x: {
            axisColor: colors.value.border,
            timeLabels: {
              color: colors.value.textMuted,
              rotation: -30,
              autoRotate: {
                enable: false,
              },
              values: timestamps.value,
              showOnlyAtModulo: true,
              modulo: 12,
              datetimeFormatter: {
                enable: true,
                useUTC: true,
                locale: "en",
                options: {
                  year: "dd MMM",
                  month: "dd MMM",
                  day: "dd MMM",
                  minute: "dd MMM",
                  second: "dd MMM",
                },
              },
            },
          },
          y: {
            showAxis: false,
            axisLabels: { show: false },
          },
        },
        highlighter: {
          color: colors.value.text,
          useLine: true,
        },
        legend: {
          show: false,
          backgroundColor: "transparent",
          color: colors.value.textMuted,
        },
        lines: {
          useArea: true,
          areaOpacity: 0.3,
          smooth: true,
          distributed: isDistributed.value,
          gradient: { show: false },
          dot: {
            useSerieColor: false,
            fill: colors.value.bg,
            strokeWidth: 1,
            radius: 3,
          },
          totalValues: { show: false },
          dataLabels: { show: false },
        },
        padding: {
          left: 48,
          right: 48,
        },
        tooltip: {
          backgroundColor: colors.value.bg,
          color: colors.value.text,
          borderColor: colors.value.border,
          backgroundOpacity: 30,
          position: tooltipPosition.value,
          offsetX: 24,
          offsetY: -64,
        },
        zoom: {
          show: false,
        },
      },
    },
  };
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
</script>

<template>
  <div>
    <div class="max-w-[450px] mx-auto mb-12">
      <ChartGlobalEventsBreakdown :data="dataset" />
    </div>

    <ChartGlobalEventsSplitSparklines
      :dataset
      :dates="timestamps"
      :selectedXIndex="selectedIndex"
      @selectIndex="setSelectedIndex"
    />

    <div class="max-w-[500px] mx-auto mt-12">
      <ChartGlobalEventsEvolution :data="dataset" :timestamps />
    </div>
  </div>
</template>
