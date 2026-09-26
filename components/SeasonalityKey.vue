<script setup>
defineProps({
  showStar: { type: Boolean, default: false },
})
</script>

<template>
  <div class="seasonality-key">
    <p v-if="showStar" class="seasonality-key__star">
      <span class="seasonality-key__star-icon">★</span>
      Sourced within 200 miles — buy fresh
    </p>
    <ul class="seasonality-key__colors">
      <li class="seasonality-key__color-item">
        <span class="seasonality-key__swatch seasonality-key__swatch--peak"></span>
        Fresh, peak availability
      </li>
      <li class="seasonality-key__color-item">
        <span class="seasonality-key__swatch seasonality-key__swatch--limited"></span>
        Fresh, limited availability
      </li>
      <li class="seasonality-key__color-item">
        <span class="seasonality-key__swatch seasonality-key__swatch--frozen"></span>
        Frozen
      </li>
      <li class="seasonality-key__color-item">
        <span class="seasonality-key__swatch seasonality-key__swatch--none"></span>
        Out of season
      </li>
    </ul>
  </div>
</template>