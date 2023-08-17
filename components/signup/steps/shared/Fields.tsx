import SearchInput from '@/components/SearchInput'
import Checkbox from '@/components/forms/inputs/Checkbox'
import { type FieldSelectable } from '@/lib/types'
import { useContext, useState } from 'react'
import { SignUpContext } from '../../SignUpContext'

type Props = React.PropsWithChildren<{ fields: FieldSelectable[] }>

export default function Fields({ fields }: Props) {
  const { goBack, goNext } = useContext(SignUpContext)
  // DRY 4
  const [availableFields, setAvailableFields] = useState<FieldSelectable[]>(fields)
  const selectedFieldsLength = availableFields.filter(field => field.selected).length

  function handleFieldInput(id: string) {
    const newFields = availableFields.map(field => {
      if (id === field.id) {
        if (!field.selected && selectedFieldsLength < 5) {
          return {
            ...field,
            selected: true,
          }
        }

        if (field.selected) {
          return {
            ...field,
            selected: false,
          }
        }
      }
      return field
    })

    setAvailableFields(newFields)
  }

  return (
    <>
      <h2 className="text-center text-xl font-bold md:text-3xl">
        ¡Elige las <span className="text-primary">áreas</span> que sea relavantes para ti!
      </h2>
      <p className="text-base">
        Para ofrecer una mejor experiencia necesitamos conocer las áreas en las que te desempeñas.
      </p>
      <div className="mx-auto w-full pt-4">
        <div className="flex justify-end">
          <SearchInput />
        </div>
        <div className="my-4 grid max-h-56 grid-cols-2 gap-x-3 gap-y-2 overflow-y-scroll overscroll-auto">
          {availableFields.map(field => {
            return (
              <Checkbox
                key={field.id}
                name={field.title}
                value={field.id}
                label={field.title}
                onInput={() => { handleFieldInput(field.id) }}
                active={field.selected}
              />
            )
          })}
        </div>
        <div className="mt-4 flex justify-between">
          <button onClick={goBack} type="button" className="btn-neutral btn">
            Volver
          </button>
          <button onClick={goNext} type="button" className="btn-primary btn">
            Siguiente
          </button>
        </div>
      </div>
    </>
  )
}
