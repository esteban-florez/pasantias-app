import SignupRadio from '@/components/signup/SignupRadio'
import { UserType as UserTypeEnum } from '@prisma/client'
import { userTypes as translation } from '@/lib/translations'
import { BuildingLibraryIcon, BuildingOffice2Icon, UserIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import { SignUpContext } from '../../SignUpContext'

type UserTypeLiteral = keyof typeof UserTypeEnum

type Props = React.PropsWithChildren<{
  userType: UserTypeLiteral | null
  setUserType: (string: UserTypeLiteral) => void
}>

const radios = {
  COMPANY: {
    description: '¡Contrata nuevos empleados y crea proyectos para impulsar el crecimiento y éxito de tu empresa!',
    icon: <BuildingOffice2Icon className="h-10 w-10 text-white" />,
  },
  INSTITUTE: {
    description: 'Gestiona las pasantías de tus estudiantes para fortalecer su preparación profesional',
    icon: <BuildingLibraryIcon className="h-10 w-10 text-white" />,
  },
  PERSON: {
    description: '¡Descubre ofertas de trabajo, crea tu perfil y encuentra tu camino al éxito profesional!',
    icon: <UserIcon className="h-10 w-10 text-white" />,
  },
}

export default function UserType({ userType, setUserType }: Props) {
  const { goNext, reset } = useContext(SignUpContext)
  const noOptionSelected = userType === null

  function handleNextButton() {
    if (noOptionSelected) return
    goNext()
  }

  const options = Object.values(UserTypeEnum).map((type) => {
    const label = translation[type]
    const { description, icon } = radios[type]
    return (
      <SignupRadio
        name="type" key={type} value={type} label={label} icon={icon}
        active={type === userType}
        onInput={() => {
          reset()
          setUserType(type)
        }}
      >
        {description}
      </SignupRadio>
    )
  })

  return (
    <>
      <h2 className="text-center text-xl font-bold md:text-3xl">
        ¡Sé <span className="text-primary">parte</span> de nuestra <span className="text-secondary">plataforma</span>!
      </h2>
      <p className="text-base">
        Asegurate de seleccionar el tipo de usuario que mejor se adapte a tí.
      </p>
      <section className="mx-auto w-full pt-4">
        <div className="space-y-4">
          {options}
        </div>
        <div className="mt-4 flex justify-between">
          <button onClick={handleNextButton} disabled={noOptionSelected} type="button" className="btn-primary btn">
            Siguiente
          </button>
        </div>
      </section>
    </>
  )
}
