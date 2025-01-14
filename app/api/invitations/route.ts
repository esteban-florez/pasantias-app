import { auth } from '@/lib/auth/api'
import { handleError } from '@/lib/errors/api'
import prisma from '@/prisma/client'
import { NextResponse, type NextRequest } from 'next/server'
import { url } from '@/lib/utils/url'
import { notFound } from 'next/navigation'
import { notify } from '@/lib/notifications/notify'
import { object } from 'zod'
import { defaults } from '@/lib/validation/schemas/defaults'
import { getTeamLeader } from '@/lib/utils/tables'
import { type Interested } from '@prisma/client'
import logEvent from '@/lib/data-fetching/log'
import { logs } from '@/lib/log'

export async function POST(request: NextRequest) {
  let data
  try {
    data = await request.json()
    const parsed = object({
      teamId: defaults.id,
      projectId: defaults.id.optional(),
    }).parse(data)
    const { id: userId, name, type, authUserId } = await auth.user(request)

    if (type !== 'PERSON') {
      notFound()
    }

    const team = await prisma.team.findFirst({
      where: { id: parsed.teamId },
      include: {
        leader: {
          include: {
            company: true,
            person: true,
          },
        },
      },
    })

    if (team == null) {
      notFound()
    }

    const leader = getTeamLeader(team)
    const interested: Interested = leader.id === userId ? 'COMPANY' : 'PERSON'

    const { projectId, ...rest } = parsed
    await prisma.invitation.create({
      data: {
        ...rest,
        personId: userId,
        interested,
      },
    })

    const authUser = await prisma.authUser.findFirstOrThrow({
      where: {
        OR: [
          {
            person: {
              id: team.leader.personId ?? '',
            },
          },
          {
            company: {
              id: team.leader.companyId ?? '',
            },
          },
        ],
      },
      select: {
        id: true,
      },
    })

    await notify('invitation-asked', authUser.id, {
      user: name,
      team: team.name,
      teamId: team.id,
    })

    const {
      invitation_create: { message, model, status },
    } = logs
    await logEvent({
      action: message,
      model,
      status,
      authUserId,
    })

    if (projectId == null) {
      return NextResponse.redirect(
        url(`/home/teams/${parsed.teamId}?alert=invitation_sent`)
      )
    }

    return NextResponse.redirect(
      url(`/home/projects/${projectId}?alert=invitation_sent`)
    )
  } catch (error) {
    return handleError(error, data)
  }
}
