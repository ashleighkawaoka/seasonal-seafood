export function useSeafoodFilters() {
  const route = useRoute()
  const router = useRouter()

  const selectedIngredient = computed({
    get: () => route.query.ingredient ?? '',
    set: (value) => updateQuery({ ingredient: value }),
  })

  const selectedMethod = computed({
    get: () => route.query.method ?? '',
    set: (value) => updateQuery({ method: value }),
  })

  function updateQuery(changes) {
    const next = { ...route.query, ...changes }
    Object.keys(next).forEach((key) => {
      if (!next[key]) delete next[key] // drop empty values from the URL
    })
    router.replace({ query: next })
  }

  function uniqueNames(items, field) {
    const names = new Set()
    items.forEach((item) => (item[field] ?? []).forEach((name) => names.add(name)))
    return Array.from(names).sort()
  }

  function matchesFilters(item) {
    const ingredientOk =
      !selectedIngredient.value || (item.ingredients ?? []).includes(selectedIngredient.value)
    const methodOk = !selectedMethod.value || (item.methods ?? []).includes(selectedMethod.value)
    return ingredientOk && methodOk
  }

  return { selectedIngredient, selectedMethod, uniqueNames, matchesFilters }
}