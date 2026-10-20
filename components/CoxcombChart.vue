<script setup>
const props = defineProps({
  fish: { type: Object, required: true },
  // Large chart shows axis names and reacts to hover, the small "similar fish" version doesn't
  labels: { type: Boolean, default: true },
})

const RADIUS = 100
// Unique per chart so the gradient ids don't clash when several charts are on the page
const uid = useId()
// How far past the edge of the chart the labels sit
const LABEL_GAP = 8
const VIEWBOX = { x: -150, y: -140, width: 300, height: 280 }

// Angles in degrees, 0 = right, 90 = top. Opposite axes share a color and highlight together.
const AXES = [
  { key: 'light', angle: 90, color: 'mint' },
  { key: 'meaty', angle: 30, color: 'pink' },
  { key: 'firm', angle: -30, color: 'yellow' },
  { key: 'rich', angle: -90, color: 'mint' },
  { key: 'flaky', angle: -150, color: 'pink' },
  { key: 'tender', angle: 150, color: 'yellow' },
]

function point(degrees, r) {
  const rad = (degrees * Math.PI) / 180
  return [+(r * Math.cos(rad)).toFixed(2), +(-r * Math.sin(rad)).toFixed(2)]
}

const triangle = (angle, r) => {
  const [x1, y1] = point(angle - 30, r)
  const [x2, y2] = point(angle + 30, r)
  return `0,0 ${x1},${y1} ${x2},${y2}`
}

// Each score is a triangle filling its 60° slice, reaching further out the higher it scores
const wedges = computed(() =>
  AXES.map((axis) => {
    const score = Math.min(Math.max(props.fish[axis.key] ?? 0, 0), 10)
    const radius = (RADIUS * score) / 10
    const [labelX, labelY] = point(axis.angle, RADIUS + LABEL_GAP)
    const gradientId = `${uid}-${axis.key}`
    return {
      ...axis,
      score,
      title: axisTitle(axis.key),
      points: triangle(axis.angle, radius),
      // Fill: purple at the center fading to red at this triangle's outer edge
      gradientId,
      gradientRadius: Math.max(radius, 1),
      fillStyle: { '--coxcomb-fill': `url(#${gradientId})` },
      // The whole slice is the hover target, so small scores are still easy to point at
      hitPoints: triangle(axis.angle, RADIUS),
      // Labels sit over the SVG as HTML so they keep their size however big the chart gets
      labelStyle: {
        left: `${(((labelX - VIEWBOX.x) / VIEWBOX.width) * 100).toFixed(2)}%`,
        top: `${(((labelY - VIEWBOX.y) / VIEWBOX.height) * 100).toFixed(2)}%`,
      },
    }
  }),
)

// Three lines through the middle mark the edges of the six slices
const lines = [0, 60, 120].map((degrees) => {
  const [x1, y1] = point(degrees, RADIUS)
  const [x2, y2] = point(degrees + 180, RADIUS)
  return { x1, y1, x2, y2 }
})

const viewBox = computed(() =>
  props.labels ? `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}` : '-102 -102 204 204',
)

const ariaLabel = computed(
  () => `Taste scores for ${props.fish.name}: ${wedges.value.map((w) => `${w.title} ${w.score} of 10`).join(', ')}`,
)

// Color of the selected pair, e.g. 'mint' shows only Light and Rich
const activePair = ref(null)

// Desktop with a mouse only, matches the media query in _coxcomb.scss
const canSelect = () =>
  props.labels && window.matchMedia('(min-width: 64rem) and (hover: hover)').matches

// Click a slice or label to show just that pair, click anywhere on the chart again to show everything
function onPlotClick(event) {
  if (!canSelect()) return
  if (activePair.value) {
    activePair.value = null
    return
  }
  const pair = event.target.closest('[data-pair]')?.dataset.pair
  if (pair) activePair.value = pair
}
</script>

<template>
  <figure
    class="coxcomb"
    :class="[{ 'coxcomb--small': !labels }, activePair && `coxcomb--active-${activePair}`]"
  >
    <div class="coxcomb__plot" @click="onPlotClick">
      <svg class="coxcomb__svg" :viewBox="viewBox" role="img" :aria-label="ariaLabel">
        <defs>
          <radialGradient
            v-for="wedge in wedges"
            :id="wedge.gradientId"
            :key="wedge.gradientId"
            gradientUnits="userSpaceOnUse"
            cx="0"
            cy="0"
            :r="wedge.gradientRadius"
          >
            <stop offset="0" class="coxcomb__stop coxcomb__stop--inner" />
            <stop offset="1" class="coxcomb__stop coxcomb__stop--outer" />
          </radialGradient>
        </defs>
        <polygon
          v-for="wedge in wedges"
          :key="wedge.key"
          class="coxcomb__wedge"
          :class="`coxcomb__wedge--${wedge.color}`"
          :points="wedge.points"
          :style="wedge.fillStyle"
        />
        <line v-for="(line, i) in lines" :key="i" class="coxcomb__axis" v-bind="line" />
        <template v-if="labels">
          <polygon
            v-for="wedge in wedges"
            :key="`${wedge.key}-hit`"
            class="coxcomb__hit"
            :points="wedge.hitPoints"
            :data-pair="wedge.color"
          />
        </template>
      </svg>

      <template v-if="labels">
        <button
          v-for="wedge in wedges"
          :key="`${wedge.key}-label`"
          type="button"
          class="coxcomb__label"
          :class="`coxcomb__label--${wedge.color}`"
          :style="wedge.labelStyle"
          :data-pair="wedge.color"
          :aria-pressed="activePair === wedge.color"
        >
          {{ wedge.title }}
        </button>
      </template>
    </div>
    <figcaption v-if="$slots.default" class="coxcomb__caption"><slot /></figcaption>
  </figure>
</template>
