<template>
  <ul class="season-legend">
    <li
      v-for="status in SEASON_STATUSES"
      :key="status.value"
      class="season-legend__item"
      :class="`season-legend__item--${status.value}`"
    >
      <span class="season-legend__swatch" aria-hidden="true" />
      {{ status.title }}
    </li>
    <li class="season-legend__item season-legend__item--frozen">
      <span class="season-legend__swatch season-legend__swatch--frozen" aria-hidden="true" />
      Frozen
    </li>
  </ul>
</template>
