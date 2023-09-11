import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'
import Button from '../Button'
import DeleteModal from '../projects/DeleteModal'

interface Props {
  id: string
  title: string
  description: string
  categories: string[]
  isOwner: boolean
  isMember: boolean
}

export default function ProjectDetails({ id, title, description, categories, isOwner, isMember }: Props) {
  return (
    <div className="card rounded-xl bg-white shadow-xl lg:flex-row">
      <div className="relative flex lg:basis-1/4">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Imagen de fondo carrusel"
          className="h-32 w-full rounded-t-lg object-cover md:h-44 lg:h-full lg:rounded-l-lg"
        />
        <img src="/onda-vertical.webp" alt="Onda-vertical" className="absolute bottom-0 right-0 hidden h-full lg:block" />
        <img src="/onda-horizontal.webp" alt="Onda-vertical" className="absolute bottom-0 block w-full lg:hidden" />
      </div>
      <div className="flex flex-col justify-center rounded-t-none p-4 lg:basis-3/4 xl:rounded-l-none">
        <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
        <div className="flex flex-wrap gap-2 text-base text-primary">
          {categories.map(category => {
            return (
              <span key={category} className="-my-1 font-semibold text-primary after:content-[','] last:after:content-[]">
                {category}
              </span>
            )
          })}
        </div>
        <p className="line-clamp-6 py-3">{description}</p>
        <div className="mx-auto flex w-full flex-col justify-between gap-3 sm:mx-0 sm:w-auto sm:flex-row sm:gap-1 sm:text-sm lg:gap-2">
          <Button
            url="/home/projects"
            style="OUTLINE"
            color="WHITE"
            hover="SECONDARY"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver al listado
          </Button>
          {!isMember && !isOwner &&
            <Button
              style="DEFAULT"
              color="PRIMARY"
              hover="WHITE"
            >
              <PencilIcon className="h-4 w-4" />
              ¡Quiero Aplicar!
            </Button>}
          {isOwner &&
            (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  url={`/home/projects/${id}/update`}
                  style="DEFAULT"
                  color="PRIMARY"
                  hover="WHITE"
                >
                  <PencilIcon className="h-4 w-4" />
                  Actualizar
                </Button>
                <DeleteModal
                  title={title}
                  action={`/api/projects/${id}`}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
