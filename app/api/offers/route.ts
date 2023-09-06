import { NextResponse, type NextRequest } from 'next/server'
import { schema } from '@/lib/validation/schemas/offer'
import { handleError } from '@/lib/errors/api'
import { url } from '@/lib/utils/url'
import prisma from '@/prisma/client'
import { auth } from '@/lib/auth/api'
import { getExpirationDate } from '@/lib/validation/expiration-dates'

export async function POST(request: NextRequest) {
  let data
  try {
    data = await request.json()
    const parsed = schema.parse(data)
    const user = await auth.user(request)

    if (user.type === 'COMPANY') {
      await prisma.offer.create({
        data: {
          ...parsed,
          companyId: user.id,
          categories: {
            connect: parsed.categories.map(category => ({ id: category })),
          },
          skills: {
            connect: parsed.skills.map(skill => {
              return {
                id: skill,
              }
            }),
          },
          expiresAt: getExpirationDate(parsed.expiresAt),
        },
      })
    }

    return NextResponse.redirect(url('/home/offers'))
  } catch (error) {
    handleError(error, data)
  }
}