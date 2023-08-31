import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'
import Button from '../Button'

interface Props {
  title: string
  expiresAt: Date | null
  description: string
  fields: string[]
}

export default function Details({ title, description, expiresAt, fields }: Props) {
  return (
    <div className="card rounded-xl bg-white shadow-xl lg:flex-row">
      <div className="relative flex lg:basis-2/5">
        <div className="absolute rounded-br-lg rounded-tl-lg bg-white/80 px-4 py-2 shadow-lg">
          <p className="text-sm font-semibold">Expira en {expiresAt?.getDate()} días</p>
        </div>
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Imagen de fondo carrusel"
          className="h-32 w-full rounded-t-lg object-cover md:h-44 lg:rounded-l-lg"
        />
        <img src="/onda-vertical.webp" alt="Onda-vertical" className="absolute bottom-0 right-0 hidden h-full lg:block" />
        <img src="/onda-horizontal.webp" alt="Onda-vertical" className="absolute bottom-0 block w-full lg:hidden" />
      </div>
      <div className="flex w-full flex-col rounded-t-none p-4 xl:rounded-l-none">
        <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
        <div className="flex flex-wrap gap-2 text-base text-primary">
          {fields.map(field => {
            return <span key={field} className="badge badge-outline">{field}</span>
          })}
        </div>
        <p className="line-clamp-6 py-3">{description}</p>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:gap-0 lg:w-auto">
          <Button
            url="/home/offers"
            style="DEFAULT"
            color="WHITE"
            hover="SECONDARY"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver al listado
          </Button>
          <Button
            style="DEFAULT"
            color="PRIMARY"
            hover="WHITE"
          >
            <PencilIcon className="h-4 w-4" />
            ¡Quiero Aplicar!
          </Button>
        </div>
      </div>
    </div>
  )
}
