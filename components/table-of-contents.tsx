type TocItem = {
  id: string
  text: string
  level: number
}

type Props = {
  items: TocItem[]
}

const TableOfContents = ({ items }: Props) => {
  return (
    <nav className="text-sm">
      <h3 className="font-bold mb-2 text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
        Contenido
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: item.level === 3 ? '1rem' : '0' }}
          >
            <a
              href={`#${item.id}`}
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
