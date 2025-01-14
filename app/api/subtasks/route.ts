import { NextResponse, type NextRequest } from 'next/server'
import { schema } from '@/lib/validation/schemas/subtask'
import { handleError } from '@/lib/errors/api'
import { url } from '@/lib/utils/url'
import prisma from '@/prisma/client'
import { auth } from '@/lib/auth/api'
import { notFound } from 'next/navigation'
import { getTaskWhereImIn } from '@/lib/data-fetching/task'
import logEvent from '@/lib/data-fetching/log'
import { logs } from '@/lib/log'

export async function POST(request: NextRequest) {
  let data
  try {
    data = await request.json()
    const parsed = schema.parse(data)
    const { id: userId, authUserId } = await auth.user(request)

    if (parsed.taskId == null) {
      notFound()
    }

    const task = await getTaskWhereImIn({ id: parsed.taskId, userId })
    if (task === null) {
      notFound()
    }

    const { members, filter, ...rest } = parsed
    if (members != null) {
      await prisma.subtask.create({
        data: {
          ...rest,
          taskId: parsed.taskId,
          status: 'PENDING',
          subparticipations: {
            createMany: {
              data: members.map(member => {
                return {
                  personId: member,
                }
              }),
            },
          },
        },
      })
    } else {
      await prisma.subtask.create({
        data: {
          ...rest,
          taskId: parsed.taskId,
          status: 'PENDING',
        },
      })
    }

    const { subtask_create: { message, model, status } } = logs
    await logEvent({
      action: message,
      model,
      status,
      authUserId,
    })

    await prisma.task.update({
      where: {
        id: parsed.taskId,
      },
      data: {
        status: null,
      },
    })

    return NextResponse.redirect(url(`/home/projects/${task.projectId}/tasks?id=${task.id}&filtered=${filter as string}&alert=subtask_created`))
  } catch (error) {
    handleError(error, data)
  }
}
