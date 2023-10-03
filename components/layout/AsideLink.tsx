import { ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'

type Props = React.PropsWithChildren<{
  link: {
    href: string
    title: string
    icon: React.ReactNode
    submenu?: undefined | Array<{
      href: string
      title: string
      icon: JSX.Element
    }>
  }
  active: boolean
  iconOnly: boolean
  onClick: () => void
}>

// TODO -> submenu pero bien
export default function AsideLink({ link, active, iconOnly, onClick }: Props) {
  const [openDropdown, setOpenDropdown] = useState(false)

  return (
    <li className="rounded-l-xl font-bold even:sm:my-2">
      {link.submenu === undefined &&
        <Link href={link.href} onClick={onClick} className={`py-4 ${iconOnly ? '' : 'mx-auto'} ${active ? 'active pointer-events-auto cursor-pointer hover:active' : ''}`}>
          {link.icon}
          <span className={clsx(iconOnly ? '' : 'hidden')}>{link.title}</span>
        </Link>}
      {'submenu' in link &&
        <>
          <div onClick={() => { setOpenDropdown(!openDropdown) }} className={`py-4 ${iconOnly ? '' : 'mx-auto'} ${active ? 'active hover:active' : ''}`}>
            {link.icon}
            <span className={clsx(iconOnly ? '' : 'hidden')}>{link.title}</span>
            <ChevronDownIcon className="h-6 w-6 self-end" />
          </div>
          <ul className={clsx({
            'transition-all delay-75 duration-75': true,
            hidden: !openDropdown,
            'gap-y-4': openDropdown,
          })}
          >
            {link.submenu?.map(item => {
              return (
                <li key={item.title} className="rounded-l-xl font-bold first:mt-4 even:sm:my-2">
                  <Link href={item.href} onClick={onClick} className={`${iconOnly ? '' : 'mx-auto'} ${active ? ' pointer-events-auto cursor-pointer' : ''}`}>
                    {item.icon}
                    <span className={clsx(iconOnly ? '' : 'hidden', 'text-sm')}>{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </>}
    </li>
  )
}
