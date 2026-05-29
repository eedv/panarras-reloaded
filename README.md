# Panarras

Sitio web de panadería casera con 96 artículos sobre recetas, técnicas y elaboración de pan artesanal.

Construido con:

- **Next.js** (Pages Router) — generación estática
- **TypeScript**
- **Tailwind CSS** — estilos
- **gray-matter** + **remark** — procesado de Markdown
- **date-fns** — formato de fechas (locale español)
- **next-themes** — modo oscuro
- **fuse.js** — búsqueda client-side

## Desarrollo

```bash
npm run dev     # servidor de desarrollo en localhost:3000
npm run build   # build de producción
npm run start   # servir build de producción
npm run typecheck  # comprobación de tipos
```

## Estructura

```
_posts/          # Artículos en Markdown con front matter
components/      # Componentes React
interfaces/      # Tipos TypeScript
lib/             # Utilidades (api, constantes, tags, markdownToHtml)
pages/           # Páginas y rutas
public/          # Estáticos (imágenes, favicon, sitemap)
styles/          # CSS global
```

Los artículos se almacenan en `_posts/` como archivos `.html.md`. El front matter incluye `title`, `coverImage`, `date`, `author`, `ogImage` y `excerpt`. Las categorías se asignan automáticamente según el nombre del archivo.
