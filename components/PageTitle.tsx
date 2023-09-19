import Link from 'next/link'
import React from 'react'
import Breadcrumbs from './layout/Breadcrumbs'

type Props = React.PropsWithChildren<{
  title: string
  subtitle?: string | {
    label: string
    name: string
    url: string
  }
  breadcrumbs?: string[] | string
}>

export default function PageTitle({ title, children, subtitle, breadcrumbs }: Props) {
  return (
    <section className="mb-4 flex flex-col justify-between gap-2 bg-white p-4 shadow md:flex-row md:items-center md:gap-0">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tighter">
          {title}
        </h1>
        {typeof subtitle === 'string' && (
          <p className="font-semibold text-neutral-600">
            {subtitle}
          </p>
        )}
        {typeof subtitle === 'object' && (
          <span className="font-semibold">
            {subtitle.label}:{' '}
            <Link className="text-primary underline" href={subtitle.url}>
              {subtitle.name}
            </Link>
          </span>
        )}
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      {children}
    </section>
  )
}
