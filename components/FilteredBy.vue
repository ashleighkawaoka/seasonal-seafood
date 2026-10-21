<script setup>
defineProps({
  // [{ value, title }]
  items: { type: Array, default: () => [] },
  placeholder: { type: String, required: true },
})
defineEmits(['remove'])
</script>

<template>
  <div class="filtered-by">
    <h2 class="filtered-by__label">Filtered by</h2>
    <div class="filtered-by__box" aria-live="polite">
      <p v-if="!items.length" class="filtered-by__placeholder">{{ placeholder }}</p>
      <ul v-else class="filtered-by__list">
        <li v-for="item in items" :key="item.value" class="filtered-by__item">
          <span class="filtered-by__tag">{{ item.title }}</span>
          <button
            type="button"
            class="filtered-by__remove"
            :aria-label="`Remove ${item.title}`"
            @click="$emit('remove', item.value)"
          >
            <BaseIcon name="close" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
