<script setup>

const props = defineProps({
  item: { type: Object, required: true },
  labeled: { type: Boolean, default: false },
})

const states = computed(() => monthStates(props.item))
</script>

<template>
  <div class="seasonality-bar" :class="{ 'seasonality-bar--labeled': labeled }">
    <div
      v-for="(state, index) in states"
      :key="index"
      class="seasonality-bar__segment"
      :class="`seasonality-bar__segment--${state}`"
    >
      <span v-if="labeled" class="seasonality-bar__month">{{ MONTH_NAMES[index].slice(0, 3) }}</span>
    </div>
  </div>
</template>