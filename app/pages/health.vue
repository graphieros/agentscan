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
  <div class="flex flex-col h-screen">
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
    <div class="h-full">
      <ChartGlobalStatusDashboard :data />
    </div>
  </div>
  <MainFooter />
</template>
