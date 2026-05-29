import Link from 'next/link'
import ThemeToggle from './theme-toggle'

const Header = () => {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 flex items-center justify-between">
      <Link href="/" className="hover:underline">
        Panarras
      </Link>
      <ThemeToggle />
    </h2>
  )
}

export default Header
