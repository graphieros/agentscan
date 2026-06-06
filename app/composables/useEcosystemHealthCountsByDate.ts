type EcosystemHealthCategoryCounts = {
  automation: number;
  mixed: number;
  organic: number;
};

export function useEcosystemHealthCountsByDate() {
  const { data } = useEcosystemHealth();

  const countsByDate = computed<Record<string, EcosystemHealthCategoryCounts>>(
    () => {
      const result: Record<string, EcosystemHealthCategoryCounts> = {};

      const dates = [
        ...new Set(data.value.map((item) => item.created_at)),
      ].sort();

      dates.forEach((date) => {
        result[date] = {
          automation: 0,
          mixed: 0,
          organic: 0,
        };
      });

      data.value.forEach((item) => {
        const dateCounts = result[item.created_at];

        if (!dateCounts) return;

        if (item.score <= 50) {
          dateCounts.automation += 1;
        } else if (item.score <= 70) {
          dateCounts.mixed += 1;
        } else {
          dateCounts.organic += 1;
        }
      });

      return result;
    },
  );

  const dates = computed(() => Object.keys(countsByDate.value).sort());

  return {
    dates,
    countsByDate,
  };
}
