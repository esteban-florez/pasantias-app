import { NextResponse, type NextRequest } from 'next/server'
import { schema } from '@/lib/validation/schemas/task'
import { handleError } from '@/lib/errors/api'
import { url } from '@/lib/utils/url'
import prisma from '@/prisma/client'
import { object, string } from 'zod'
import messages from '@/lib/validation/messages'
import { auth } from '@/lib/auth/api'
import { redirect } from 'next/navigation'
import collect from '@/lib/utils/collection'

export async function POST(request: NextRequest) {
  let data
  try {
    data = await request.json()
    const parsed = schema.parse(data)
    const activeUser = await auth.user(request)

    const validationSchema = object({
      projectId: string(messages.string)
        .cuid(messages.cuid),
    })

    const appendParsed = validationSchema.parse(data)
    const backUrl = `/home/projects/${appendParsed.projectId}`

    const project = await prisma.project.findFirst({
      where: { id: appendParsed.projectId },
      include: {
        team: {
          include: {
            memberships: {
              where: {
                OR: [
                  { companyId: activeUser.id },
                  { personId: activeUser.id },
                ],
              },
            },
          },
        },
      },
    })

    if (project === null || collect(project?.team.memberships ?? []).first() === null) {
      redirect(backUrl)
    }

    await prisma.task.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        project: {
          connect: {
            id: appendParsed.projectId,
          },
        },
        status: 'PENDING',
        participations: {
          createMany: {
            data: parsed.members.map(member => {
              return {
                isLeader: member === parsed.responsable,
                membershipId: member,
              }
            }),
          },
        },
      },
    })

    return NextResponse.redirect(url(backUrl))
  } catch (error) {
    handleError(error, data)
  }
}
