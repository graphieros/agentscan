<script setup lang="ts">
const route = useRoute();
const isHomePage = computed<boolean>(() => route.name === "index");
</script>

<template>
  <header class="h-12 flex justify-between items-center px-4 md:px-6 py-4">
    <nav>
      <ul class="flex items-center gap-3 md:gap-4">
        <li v-if="!isHomePage">
          <NuxtLink
            class="flex gap-2 items-center text-gh-text"
            to="/"
            aria-label="Homepage"
          >
            <MainLogo size="xs" />
            <span class="hidden md:block">AgentScan</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <nav>
      <ul class="flex items-center gap-4">
        <li>
          <NuxtLink
            to="/health"
            class="inline-flex items-center text-sm text-gh-muted hover:text-gh-text transition-colors"
          >
            Ecosystem health
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/lab"
            class="inline-flex items-center text-sm text-gh-muted hover:text-gh-text transition-colors"
          >
            The lab
          </NuxtLink>
        </li>
        <li class="hidden md:block w-px h-4 bg-gh-border/80"></li>
        <li>
          <NuxtLink
            external
            target="_blank"
            to="https://github.com/marketplace/actions/agentscan"
            class="inline-flex items-center px-2.5 gap-1 py-1 text-xs font-medium rounded-full border border-gh-border/80 text-gh-muted hover:text-gh-text hover:border-gh-border/60 transition-colors whitespace-nowrap"
            title="Use it as a GitHub Action"
          >
            GitHub action
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
