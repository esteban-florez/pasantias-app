import prisma from '@/prisma/client'
import authOptions from '@/lib/auth-options'
import { type Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  // TODO -> Este debería pasar a la ruta professional/[id]/route.ts
  const session = await getServerSession(authOptions)
  const body = await req.formData()
  const data = Object.fromEntries(body.entries()) as unknown as Prisma.ProfileUpdateInput

  let profile
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email ?? '',
      },
    })

    profile = await prisma.profile.update({
      where: {
        userId: user?.id,
      },
      data,
    })
  } catch (error) {
    // TODO -> las respuestas de error deben tener detalles sobre el error
    return NextResponse.json('error', {
      status: 401,
    })
  }

  return NextResponse.json(profile, {
    status: 200,
  })
}
