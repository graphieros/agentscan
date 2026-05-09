<script setup lang="ts">
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
      <li class="flex gap-2 items-center">
        <span class="size-2 bg-green-500 block rounded-full"></span>
        <p>Organic <span class="text-gh-muted">5.8% (46)</span></p>
      </li>
      <li class="flex gap-2 items-center">
        <span class="size-2 bg-amber-500 block rounded-full"></span>
        <p>Mixed <span class="text-gh-muted">4.3% (34)</span></p>
      </li>
      <li class="flex gap-2 items-center">
        <span class="size-2 bg-orange-500 block rounded-full"></span>
        <p>Automation <span class="text-gh-muted">90% (720)</span></p>
      </li>
    </ul>
    <div class="h-full max-h-[300px] sm:max-h-[500px]">
      <ChartGlobalStatusDashboard :data />
    </div>
  </div>
  <MainFooter />
</template>
