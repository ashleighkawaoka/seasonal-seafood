<script setup>
const props = defineProps({
  fish: { type: Object, required: true },
  labels: { type: Boolean, default: false },
})

const months = computed(() => {
  const frozen = props.fish.frozenMonths ?? []
  return MONTHS.map((month, i) => ({
    ...month,
    status: monthStatus(props.fish, i),
    isFrozen: frozen.includes(i + 1),
  }))
})

const summary = computed(() => {
  const inSeason = months.value.filter((month) => month.status === 'in-season')
  const fresh = inSeason.length === 12
    ? 'In season year-round'
    : inSeason.length
      ? `In season: ${inSeason.map((month) => month.name).join(', ')}`
      : 'Not in season fresh'
  return `${fresh}. ${frozenSummary(props.fish.frozenMonths)}`
})
</script>

<template>
  <div class="season-bar" :class="{ 'season-bar--labeled': labels }" role="img" :aria-label="summary">
    <ol class="season-bar__months">
      <li
        v-for="month in months"
        :key="month.key"
        class="season-bar__month"
        :class="`season-bar__month--${month.status}`"
      >
        <span class="season-bar__diamond" :class="{ 'season-bar__diamond--frozen': month.isFrozen }" />
        <span v-if="labels" class="season-bar__label">
          <span class="season-bar__label-short">{{ month.letter }}</span>
          <span class="season-bar__label-long">{{ month.abbr }}</span>
        </span>
      </li>
    </ol>
  </div>
</template>
