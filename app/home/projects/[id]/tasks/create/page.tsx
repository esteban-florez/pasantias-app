import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import CreateTaskForm from '@/components/task-create/CreateTaskForm'
import { PlusIcon } from '@heroicons/react/24/solid'
// import { auth } from '@/lib/auth/pages'

export const metadata: Metadata = {
  title: 'Tareas',
}

interface Context {
  params: { id: string }
}

export default async function CrateTaskPage({ params: { id } }: Context) {
  // const activeUser = await auth.person()

  // Todo -> add redirect alert.
  if (id === null) redirect('/home/projects')

  return (
    <section className="container px-10 py-8">
      <div className="relative flex h-28 items-center rounded-t-xl bg-primary px-6 py-4 text-white shadow">
        <div className="z-20 flex items-center gap-1">
          <PlusIcon className="h-9 w-9 font-bold" />
          <h2 className="text-4xl font-bold tracking-tighter">Crear tarea</h2>
        </div>
        <img src="/coso3.webp" alt="Imagen decorativa en esquinas" className="pointer-events-none absolute left-0 top-0 h-48 w-full rounded-t-xl" />
      </div>
      <CreateTaskForm projectId={id} />
    </section>
  )
}
