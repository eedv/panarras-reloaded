const tagRules: [RegExp, string][] = [
  [/masa[- ]madre|pain[- ]au[- ]levain|sourdough/i, 'Masa madre'],
  [/baguette/i, 'Baguettes'],
  [/hogaza/i, 'Hogazas'],
  [/brioche|croissant|donuts|panettone|roscón|pralines|mediasnoches/i, 'Bollería'],
  [/pizza/i, 'Pizza'],
  [/focaccia/i, 'Focaccia'],
  [/chapata/i, 'Chapata'],
  [/amasado|formado|plegados|preformado|horneado|cortes|mezclado|fermentación|fermentacion|prefermentos|tang-?zhong/i, 'Técnicas'],
  [/harinas|trigos|conoce/i, 'Ingredientes'],
  [/medida|tiempo|equipamiento|enfriado|conservación|conservacion|fases/i, 'Conceptos'],
  [/pan[- ](?:de|con|cotidiano|integral|viejuno|candeal|citrico|semolina|semola|molde)/i, 'Panes de molde y especiales'],
  [/pan(?:ecillos|ettone)?\b/i, 'Panes'],
]

export function getTagsFromSlug(slug: string): string[] {
  const tags: string[] = []
  for (const [regex, tag] of tagRules) {
    if (regex.test(slug)) {
      tags.push(tag)
    }
  }
  return tags.length > 0 ? tags : ['General']
}

export function getAllTagsFromPosts(
  posts: { slug: string }[]
): string[] {
  const tagSet = new Set<string>()
  for (const post of posts) {
    const tags = getTagsFromSlug(post.slug)
    tags.forEach((t) => tagSet.add(t))
  }
  return Array.from(tagSet).sort()
}
