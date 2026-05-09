<script setup lang="ts">
import type { VueUiStacklineDatasetItem } from "vue-data-ui/vue-ui-stackline";
import {
  VueUiXy,
  type VueUiXyDatasetItem,
  type VueUiXyConfig,
} from "vue-data-ui/vue-ui-xy";
import { useChartTooltipPosition } from "~/composables/useChartTooltipPosition";
import { useColors } from "~/composables/useColors";

const props = defineProps<{
  data: VueUiStacklineDatasetItem[];
  timestamps: string[];
  width: number;
  height: number;
}>();

const rootEl = shallowRef<HTMLElement | null>(null);
const chartRef = useTemplateRef("chartRef");

onMounted(async () => {
  rootEl.value = document.documentElement;
});

const colors = useColors(rootEl);

const dataset = computed<VueUiXyDatasetItem[]>(() =>
  props.data.map((d) => ({
    ...d,
    type: "line",
    smooth: true,
    useArea: true,
  })),
);

const tooltipPosition = useChartTooltipPosition(chartRef);

const config = computed<VueUiXyConfig>(() => ({
  useCssAnimation: false,
  chart: {
    userOptions: { show: false },
    backgroundColor: "transparent",
    color: colors.value.textMuted,
    width: props.width,
    height: props.height,
    padding: {
      left: 0,
      right: 0,
    },
    grid: {
      position: "middle",
      stroke: colors.value.borderLight,
      showHorizontalLines: false,
      showVerticalLines: false,
      labels: {
        show: false,
        color: colors.value.textMuted,
        fontSize: 14,
        axis: {
          yLabelOffsetX: 0,
          fontSize: 24,
        },
        xAxisLabels: {
          show: false,
          values: props.timestamps,
          color: colors.value.textMuted,
          fontSize: 14,
          showOnlyAtModulo: true,
          modulo: 12,
          rotation: -30,
          autoRotate: {
            enable: false,
          },
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
        yAxis: {
          useNiceScale: true,
          commonScaleSteps: 5,
        },
      },
    },
    highlighter: {
      color: colors.value.text,
    },
    legend: { show: false },
    tooltip: {
      backgroundColor: colors.value.bg,
      color: colors.value.text,
      borderColor: colors.value.border,
      backgroundOpacity: 30,
      position: tooltipPosition.value,
      offsetX: 24,
      offsetY: -44,
    },
    zoom: {
      show: false,
      color: colors.value.text,
      keepState: true,
      preview: {
        strokeDasharray: 6,
        fill: "transparent",
      },
      minimap: {
        show: true,
        selectedColor: colors.value.textMuted,
        selectedColorOpacity: 0.15,
        indicatorColor: colors.value.text,
        handleFill: colors.value.bg,
        frameColor: colors.value.borderLight,
      },
    },
  },
}));
</script>

<template>
  <ClientOnly>
    <VueUiXy ref="chartRef" :dataset :config>
      <template #area-gradient="{ series, id }">
        <linearGradient :id x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" :stop-color="series.color" stop-opacity="0.3" />
          <stop offset="100%" :stop-color="colors.bg" stop-opacity="0" />
        </linearGradient>
      </template>

      <template #tooltip="{ datapoint, timeLabel }">
        <div class="flex flex-col">
          <div class="mb-1">{{ timeLabel.text }}</div>
          <div
            class="flex flex-row gap-2 items-center"
            v-for="series in datapoint"
            :key="`${series.name}-${series.absoluteIndex}`"
          >
            <div class="h-3 w-3">
              <svg viewBox="0 0 2 2" class="w-full h-full">
                <circle cx="1" cy="1" r="1" :fill="series.color" />
              </svg>
            </div>
            <span :style="{ color: colors.textMuted }">{{ series.name }}</span>
            <span>{{ series.value }}</span>
          </div>
        </div>
      </template>
    </VueUiXy>
  </ClientOnly>
</template>
