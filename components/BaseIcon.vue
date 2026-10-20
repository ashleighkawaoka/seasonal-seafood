<script setup>
defineProps({
  // 'chevron' | 'close' | 'back'
  name: { type: String, required: true },
})
</script>

<template>
  <svg class="icon" :class="`icon--${name}`" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <template v-if="name === 'chevron'">
      <circle class="icon__bg" cx="12" cy="12" r="12" />
      <path class="icon__stroke" d="M7.5 10l4.5 4.5 4.5-4.5" />
    </template>
    <template v-else-if="name === 'close'">
      <circle class="icon__bg" cx="12" cy="12" r="12" />
      <path class="icon__stroke" d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
    </template>
    <template v-else-if="name === 'back'">
      <circle class="icon__bg" cx="12" cy="12" r="11" />
      <path class="icon__stroke" d="M13.5 8l-4 4 4 4" />
    </template>
  </svg>
</template>
