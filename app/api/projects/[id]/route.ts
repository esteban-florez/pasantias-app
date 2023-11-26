import { schema } from '@/lib/validation/schemas/server/project'
import { auth } from '@/lib/auth/api'
import { handleError } from '@/lib/errors/api'
import prisma from '@/prisma/client'
import { NextResponse, type NextRequest } from 'next/server'
import { url } from '@/lib/utils/url'
import { notFound } from 'next/navigation'
import collect from '@/lib/utils/collection'
import { deleteProject, getMyProject } from '@/lib/data-fetching/project'
import { storeFile } from '@/lib/storage/storeFile'

export async function PUT(request: NextRequest, { params: { id } }: PageContext) {
  let data
  try {
    const formData = await request.formData()
    data = Object.fromEntries(formData.entries())
    const parsed = schema.parse(data)
    const { id: userId, type } = await auth.user(request)

    const project = await getMyProject({ id, userId })
    if (project === null) {
      notFound()
    }

    const projectImagePath = parsed.image !== undefined
      ? await storeFile(parsed.image)
      : null

    const projectCategories = collect(project.categories).ids()
    const newCategories = collect(parsed.categories).deleteDuplicatesFrom(projectCategories)

    if (type === 'PERSON') {
      if (parsed.teamId != null) {
        const updateParsed = { personId: null, ...parsed }
        const { teamId, ...rest } = updateParsed
        const parsedData = project.teamId !== parsed.teamId ? { teamId: project.teamId ?? teamId, ...rest } : updateParsed
        const parsedAndFields = { ...parsedData, image: projectImagePath }

        await prisma.project.update({
          where: { id },
          data: {
            ...parsedAndFields,
            categories: {
              set: parsed.categories.map(id => ({ id })),
            },
          },
        })

        // TODO -> revisar mejor cual alert se muestra en que situación.
        const alert = project.teamId === null ? 'project_updated' : 'project_team_unalterable'

        return NextResponse.redirect(url(`home/projects/${project.id}?alert=${alert}`))
      } else {
        const parsedAndFields = { ...parsed, image: projectImagePath }

        await prisma.project.update({
          where: { id },
          data: {
            ...parsedAndFields,
            categories: {
              deleteMany: {
                id: {
                  notIn: parsed.categories,
                },
              },
              connect: newCategories.map(id => ({ id })),
            },
          },
        })
      }
    }

    if (type === 'COMPANY') {
      const { teamId, ...rest } = parsed
      const parsedData = project.teamId !== parsed.teamId ? rest : parsed
      const parsedAndFields = { ...parsedData, image: projectImagePath }

      await prisma.project.update({
        where: { id },
        data: {
          ...parsedAndFields,
          categories: {
            deleteMany: {
              id: {
                notIn: parsed.categories,
              },
            },
            connect: newCategories.map(id => ({ id })),
          },
        },
      })
    }

    return NextResponse.redirect(url(`home/projects/${project.id}?alert=project_updated`))
  } catch (error) {
    return handleError(error, data)
  }
}

// TODO -> test
export async function DELETE(request: NextRequest, { params: { id } }: PageContext) {
  try {
    const { id: userId } = await auth.user(request)

    // DRY My records
    await deleteProject({
      id,
      where: {
        OR: [
          { personId: userId },
          {
            team: {
              leader: {
                OR: [
                  { personId: userId },
                  { companyId: userId },
                ],
              },
            },
          },
        ],
      },
    })

    return NextResponse.redirect(url('/home/projects?alert=project_deleted'))
  } catch (error) {
    return handleError(error)
  }
}
