<script setup>
// Shared search bar: input plus a clear button. The label lives in the parent (pass its id here).
defineProps({
  id: { type: String, required: true },
  placeholder: { type: String, default: 'Search' },
  // 'white' for a solid white bar, otherwise translucent in the page's accent color
  variant: { type: String, default: null },
})

const model = defineModel({ type: String, default: '' })
</script>

<template>
  <div class="search-field" :class="variant && `search-field--${variant}`">
    <input
      :id="id"
      v-model="model"
      class="search-field__input"
      type="search"
      :placeholder="placeholder"
      autocomplete="off"
    />
    <button v-if="model" type="button" class="search-field__clear" aria-label="Clear search" @click="model = ''">
      <BaseIcon name="close" />
    </button>
  </div>
</template>
