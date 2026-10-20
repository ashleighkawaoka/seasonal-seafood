const FISH_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  habitat,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  light,
  rich,
  tender,
  firm,
  flaky,
  meaty,
  tasteProfile,
  heartyScore,
  cookingMethods,
  pairings,
  freshSeason,
  frozenMonths
`

export const FISH_LIST_QUERY = `*[_type == "fish"] | order(name asc) { ${FISH_FIELDS} }`

export const FISH_DETAIL_QUERY = `*[_type == "fish" && slug.current == $slug][0] {
  ${FISH_FIELDS},
  "similarFish": similarFish[]-> { _id, name, "slug": slug.current, light, rich, tender, firm, flaky, meaty }
}`

export const MARKET_LIST_QUERY = `*[_type == "fishMarket"] { _id, name, area, address, location }`
