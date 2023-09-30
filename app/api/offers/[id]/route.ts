import { schema } from '@/lib/validation/schemas/offer'
import { auth } from '@/lib/auth/api'
import { handleError } from '@/lib/errors/api'
import prisma from '@/prisma/client'
import { NextResponse, type NextRequest } from 'next/server'
import { url } from '@/lib/utils/url'
import { notFound } from 'next/navigation'
import collect from '@/lib/utils/collection'
import { getExpirationDate } from '@/lib/validation/expiration-dates'

export async function PUT(request: NextRequest, { params: { id } }: PageContext) {
  let data
  try {
    data = await request.json()
    const parsed = schema.parse(data)
    const activeUser = await auth.user(request)

    const offer = await prisma.offer.findFirst({
      where: {
        AND: [
          { id },
          { companyId: activeUser.id },
        ],
      },
      include: {
        categories: true,
        skills: true,
        location: true,
      },
    })

    if (offer === null) {
      notFound()
    }

    const offerSkills = offer.skills.map(skill => skill.id)
    const offerCategories = offer.categories.map(category => category.id)

    const skills = collect(parsed.skills).deleteDuplicatesFrom(offerSkills)
    const categories = collect(parsed.categories).deleteDuplicatesFrom(offerCategories)

    await prisma.offer.update({
      where: {
        id,
      },
      data: {
        ...parsed,
        categories: {
          deleteMany: {
            id: {
              notIn: parsed.categories,
            },
          },
          connect: categories.map(id => ({ id })),
        },
        skills: {
          deleteMany: {
            id: {
              notIn: parsed.skills,
            },
          },
          connect: skills.map(id => ({ id })),
        },
        expiresAt: getExpirationDate(parsed.expiresAt),
      },
    })

    return NextResponse.redirect(url(`/home/offers/${id}?alert=offer_updated`))
  } catch (error) {
    return handleError(error, data)
  }
}

export async function DELETE(request: NextRequest, { params: { id } }: PageContext) {
  try {
    const activeUser = await auth.user(request)

    const offer = await prisma.offer.findFirst({
      where: {
        AND: [
          { id },
          { companyId: activeUser.id },
        ],
      },
    })

    if (offer == null) {
      notFound()
    }

    await prisma.offer.deleteMany({
      where: { id },
    })

    return NextResponse.redirect(url('/home/offers?alert=offer_deleted'))
  } catch (error) {
    return handleError(error)
  }
}
