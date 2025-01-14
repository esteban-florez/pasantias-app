import { type Metadata } from 'next'
import prisma from '@/prisma/client'
import { auth } from '@/lib/auth/pages'
import { getOffers } from '@/lib/data-fetching/offer'
import getPaginationProps from '@/lib/utils/pagination'
import { getPersonRelatedIds } from '@/lib/data-fetching/user'
import { type Prisma } from '@prisma/client'
import Pagination from '@/components/Pagination'
import PageTitle from '@/components/PageTitle'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'
import Carousel from '@/components/carousel/Carousel'
import { tooltip } from '@/lib/tooltip'
import { notFound } from 'next/navigation'
import FilterBar from '@/components/FilterBar'
import OffersList from '@/components/offers/OffersList'

export const metadata: Metadata = {
  title: 'Ofertas',
}

interface FilterQueries {
  all: Prisma.OfferWhereInput
  applied: Prisma.OfferWhereInput
  personal: Prisma.OfferWhereInput
  suggested: Prisma.OfferWhereInput
}

export default async function OffersPage({
  searchParams: { filtered, page, search },
}: SearchParamsProps) {
  const { id, type } = await auth.user()
  if (type === 'ADMIN' || type === 'INSTITUTE') {
    notFound()
  }

  const { jobs, categories, skills } = await getPersonRelatedIds({ id })

  // DRY Pagination
  const filterParam = Array.isArray(filtered) ? filtered[0] : filtered
  const pageNumber = +(page ?? 1)
  const searchParam = Array.isArray(search) ? search[0] : search

  const FILTER_QUERIES: FilterQueries = {
    suggested: {
      expiresAt: {
        gt: new Date(),
      },
      limit: {
        gt: 0,
      },
      NOT: {
        hiring: {
          some: {
            personId: id,
          },
        },
      },
      OR: [
        {
          title: {
            contains: searchParam,
            mode: 'insensitive',
          },
        },
        // {
        //   description: {
        //     contains: searchParam,
        //     mode: 'insensitive',
        //   },
        // },
        // {
        //   company: {
        //     name: {
        //       contains: searchParam,
        //       mode: 'insensitive',
        //     },
        //   },
        // },
        // {
        //   location: {
        //     title: {
        //       contains: searchParam,
        //       mode: 'insensitive',
        //     },
        //   },
        // },
        {
          categories: {
            some: {
              id: { in: categories },
            },
          },
        },
        {
          jobId: {
            in: jobs,
          },
        },
        {
          skills: {
            some: {
              id: { in: skills },
            },
          },
        },
      ],
    },
    personal: {
      title: {
        contains: searchParam,
        mode: 'insensitive',
      },
      // OR: [
      //   {
      //   },
      //   {
      //     description: {
      //       contains: searchParam,
      //       mode: "insensitive",
      //     },
      //   },
      //   {
      //     company: {
      //       name: {
      //         contains: searchParam,
      //         mode: "insensitive",
      //       },
      //     },
      //   },
      //   {
      //     location: {
      //       title: {
      //         contains: searchParam,
      //         mode: "insensitive",
      //       },
      //     },
      //   },
      // ],
      companyId: id,
    },
    applied: {
      title: {
        contains: searchParam,
        mode: 'insensitive',
      },
      // OR: [
      //   {
      //   },
      //   {
      //     description: {
      //       contains: searchParam,
      //       mode: "insensitive",
      //     },
      //   },
      //   {
      //     company: {
      //       name: {
      //         contains: searchParam,
      //         mode: "insensitive",
      //       },
      //     },
      //   },
      //   {
      //     location: {
      //       title: {
      //         contains: searchParam,
      //         mode: "insensitive",
      //       },
      //     },
      //   },
      // ],
      hiring: { some: { personId: id } },
    },
    all: {
      title: {
        contains: searchParam,
        mode: 'insensitive',
      },
      // OR: [
      //   {
      //   },
      //   {
      //     description: {
      //       contains: searchParam,
      //       mode: "insensitive",
      //     },
      //   },
      //   {
      //     company: {
      //       name: {
      //         contains: searchParam,
      //         mode: "insensitive",
      //       },
      //     },
      //   },
      //   {
      //     location: {
      //       title: {
      //         contains: searchParam,
      //         mode: "insensitive",
      //       },
      //     },
      //   },
      // ],
      NOT: {
        hiring: {
          some: {
            personId: id,
          },
        },
      },
      AND: [{ companyId: { not: id } }, { expiresAt: { gte: new Date() } }],
    },
  }
  const totalRecords = await prisma.offer.count({
    where:
      FILTER_QUERIES[
        filterParam === '' ? 'all' : (filterParam as keyof FilterQueries)
      ],
  })
  const { nextPage, skip, take, totalPages } = getPaginationProps({
    pageNumber,
    totalRecords,
  })

  const offers = await getOffers({
    where: FILTER_QUERIES[filterParam as keyof FilterQueries],
    take,
    skip,
  })
  const carouselOffers = await getOffers({
    where: { companyId: { not: id } },
    skip: 0,
    take: 5,
  })

  const options = [
    {
      id: 'suggested',
      name: 'Sugeridas',
    },
    {
      id: 'applied',
      name: 'Aplicadas',
    },
  ]

  if (type === 'COMPANY') {
    options.splice(0, 3)
    options.push({
      id: 'personal',
      name: 'Mis ofertas',
    })
  }

  return (
    <>
      <PageTitle
        title="Ofertas laborales"
        subtitle={tooltip.offer}
      >
        {type === 'COMPANY' && (
          <Link href="/home/offers/create">
            <button className="btn-primary btn hover:border-primary hover:bg-white hover:text-neutral-600">
              <PlusIcon className="h-6 w-6" />
              Agregar
            </button>
          </Link>
        )}
      </PageTitle>
      <FilterBar
        key={filterParam}
        searchLabel="Nombre"
        filterLabel="Categorías"
        filterOptions={options}
        selectedOption={filterParam}
      />
      <Carousel items={carouselOffers} />
      <OffersList offers={offers} />
      <Pagination
        currentPage={pageNumber}
        nextPage={nextPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        queryParams={{
          filtered: filterParam,
          search,
        }}
      />
    </>
  )
}
