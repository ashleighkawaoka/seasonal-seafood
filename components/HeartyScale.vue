<script setup>
const props = defineProps({
  fish: { type: Object, required: true },
})

const score = computed(() => Math.min(Math.max(props.fish.heartyScore ?? 0, 0), 10))

const NUMBERS = Array.from({ length: 11 }, (_, n) => n)
const position = (n) => `${n * 10}%`
</script>

<template>
  <div class="hearty-scale" role="img" :aria-label="`Thickness ${score} out of 10, from thin and lean to thick and hearty`">
    <span class="hearty-scale__end" aria-hidden="true">Thin / Lean</span>
    <div class="hearty-scale__track" aria-hidden="true">
      <span class="hearty-scale__marker" :style="{ left: position(score) }" />
      <ol class="hearty-scale__numbers">
        <li v-for="n in NUMBERS" :key="n" class="hearty-scale__number" :style="{ left: position(n) }">
          {{ n }}
        </li>
      </ol>
    </div>
    <span class="hearty-scale__end" aria-hidden="true">Thick / Hearty</span>
  </div>
</template>
