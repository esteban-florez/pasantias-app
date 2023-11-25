import { NextResponse, type NextRequest } from 'next/server'
import { schema } from '@/lib/validation/schemas/subtask'
import { handleError } from '@/lib/errors/api'
import { url } from '@/lib/utils/url'
import prisma from '@/prisma/client'
import { auth } from '@/lib/auth/api'
import { notFound } from 'next/navigation'
import { deleteSubtask, getMySubtask } from '@/lib/data-fetching/subtask'
import collect from '@/lib/utils/collection'

export async function PUT(request: NextRequest, { params: { id } }: PageContext) {
  let data
  try {
    data = await request.json()
    const parsed = schema.parse(data)
    const { id: userId } = await auth.user(request)

    const subtask = await getMySubtask({ id, userId })
    if (subtask == null) {
      notFound()
    }

    const { members, ...rest } = parsed

    if (members != null) {
      const subtasksSubparticipations = subtask.subparticipations.map(subparticipation => subparticipation.personId)
      const newSubparticipations = collect(members).deleteDuplicatesFrom(subtasksSubparticipations)

      await prisma.subtask.update({
        where: {
          id: subtask.id,
        },
        data: {
          ...rest,
          subparticipations: {
            deleteMany: {
              personId: { notIn: members },
            },
            createMany: {
              data: newSubparticipations.map(member => {
                return {
                  personId: member,
                }
              }),
            },
          },
        },
      })
    } else {
      await prisma.subtask.update({
        where: {
          id: subtask.id,
        },
        data: {
          ...rest,
        },
      })
    }

    return NextResponse.redirect(url(`/home/projects/${subtask.task.projectId}/tasks?alert=subtask_updated`))
  } catch (error) {
    handleError(error, data)
  }
}

export async function DELETE(request: NextRequest, { params: { id } }: PageContext) {
  try {
    const { id: userId } = await auth.user(request)
    const subtask = await getMySubtask({ id, userId })
    const deletedSubtask = await deleteSubtask({ id, userId })

    if (subtask == null) {
      notFound()
    }

    if (deletedSubtask.count === 0) {
      notFound()
    }

    return NextResponse.redirect(url(`/home/projects/${subtask?.task.projectId}/tasks?alert=subtask_deleted`))
  } catch (error) {
    return handleError(error)
  }
}
