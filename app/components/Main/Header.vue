<script setup lang="ts">
const route = useRoute();
const isHomePage = computed<boolean>(() => route.name === "index");

const isMenuOpen = ref<boolean>(false);
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

watch(isMenuOpen, (value) => {
  if (value) {
    window.document.body.classList.add("overflow-hidden");
  } else {
    window.document.body.classList.remove("overflow-hidden");
  }
});

watch(
  () => route.path,
  () => {
    isMenuOpen.value = false;
  },
);

onBeforeUnmount(() => {
  window.document.body.classList.remove("overflow-hidden");
});
</script>

<template>
  <header class="h-12 flex justify-between items-center px-4 lg:px-6 py-4">
    <div>
      <NuxtLink
        v-if="!isHomePage"
        class="flex gap-2 items-center text-gh-text"
        to="/"
        aria-label="Homepage"
      >
        <MainLogo size="xs" />
        AgentScan
      </NuxtLink>
    </div>

    <div
      :class="{
        'fixed inset-0 bg-gh-bg z-40 lg:relative flex flex-col gap-4 p-4 h-svh lg:h-auto lg:block lg:relative lg:bg-none':
          isMenuOpen,
      }"
    >
      <button @click="toggleMenu" class="lg:hidden flex self-end">
        <span v-if="isMenuOpen" class="i-lucide:x"></span>
        <span v-else class="i-lucide:menu"></span>
      </button>

      <nav
        class="lg:block h-full lg:h-auto"
        :class="{
          hidden: !isMenuOpen,
        }"
      >
        <ul
          class="flex items-center gap-2 lg:gap-4"
          :class="{
            'flex justify-center h-full flex-col lg:flex lg:flex-row lg:h-auto ':
              isMenuOpen,
          }"
        >
          <li>
            <MainMenuItem to="/health" label="GitHub Ecosystem Health" />
          </li>
          <li>
            <MainMenuItem
              to="/detected-automations"
              label="Detected automations"
            />
          </li>
          <li>
            <MainMenuItem to="/automations" label="Community automations" />
          </li>
          <li>
            <MainMenuItem to="/lab" label="The lab" />
          </li>
          <li class="hidden lg:block w-px h-4 bg-gh-border/80"></li>
          <li>
            <NuxtLink
              external
              target="_blank"
              to="https://github.com/marketplace/actions/agentscan"
              class="inline-flex mt-4 lg:mt-0 items-center px-3.5 lg:px-2.5 gap-1 py-1 font-medium text-md lg:text-xs rounded-full border border-gh-border/80 text-gh-muted hover:text-gh-text hover:border-gh-border/60 transition-colors whitespace-nowrap"
              title="Use it as a GitHub Action"
            >
              GitHub action
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
