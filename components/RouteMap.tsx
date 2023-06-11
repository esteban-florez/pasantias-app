'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from '@/styles/RouteMap.module.css'
import TranslatedRoutes from '@/translations/es'

interface Props {
  width: boolean
}

export default function RoutePath({ width }: Props) {
  const router = usePathname()

  const structuredPath = () => {
    const routes = router.split('/')
    const currentRoutes = routes.filter((route) => route !== '')

    return ['home', ...currentRoutes]
  }

  const currentPaths = structuredPath()
  const currentPath = structuredPath().pop()

  return (
    <div
      className={`${styles.breadcrumbs} flex ${
        width ? 'w-full' : 'w-3/6'
      } items-center justify-start p-4 text-sm`}
    >
      <ul>
        <li>~</li>
        {currentPaths.map((path) => {
          return (
            <li key={path}>
              <Link
                href={`/${path === 'home' ? '' : path}`}
                className={`capitalize no-underline hover:no-underline ${
                  path === currentPath ? 'font-bold text-sky-400' : ''
                }`}
              >
                {TranslatedRoutes({ route: path })}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}