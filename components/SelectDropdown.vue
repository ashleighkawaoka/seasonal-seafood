<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'All' },
})
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const activeIndex = ref(-1)
const root = ref(null)

const displayLabel = computed(() => props.modelValue || props.placeholder)

function select(option) {
  emit('update:modelValue', option) // option is '' for "All"
  isOpen.value = false
}

function toggleOpen() {
  isOpen.value = !isOpen.value
  activeIndex.value = -1
}

function onKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    isOpen.value = true
    activeIndex.value = Math.min(activeIndex.value + 1, props.options.length) // +1 for "All"
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === 'Enter' && isOpen.value) {
    event.preventDefault()
    const chosen = activeIndex.value === 0 ? '' : props.options[activeIndex.value - 1]
    if (activeIndex.value >= 0) select(chosen)
  } else if (event.key === 'Escape') {
    isOpen.value = false
  }
}

function onClickOutside(event) {
  if (root.value && !root.value.contains(event.target)) isOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="root" class="select-dropdown">
    <button
      type="button"
      class="select-dropdown__button"
      :class="{ 'is-open': isOpen, 'is-placeholder': !modelValue }"
      @click="toggleOpen"
      @keydown="onKeydown"
    >
      {{ displayLabel }}
    </button>

    <ul v-if="isOpen" class="select-dropdown__list" role="listbox">
      <li
        class="select-dropdown__option"
        :class="{ 'is-active': activeIndex === 0, 'is-selected': !modelValue }"
        @click="select('')"
        @mouseenter="activeIndex = 0"
      >
        {{ placeholder }}
      </li>
      <li
        v-for="(option, index) in options"
        :key="option"
        class="select-dropdown__option"
        :class="{ 'is-active': activeIndex === index + 1, 'is-selected': modelValue === option }"
        @click="select(option)"
        @mouseenter="activeIndex = index + 1"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>