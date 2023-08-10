'use client'

import { useState } from 'react'
import { type FieldOption } from '@/lib/types'
import StepIndicator from './StepIndicator'
import { type UserType as UserTypeEnum } from '@prisma/client'
import Steps from './Steps'

type Props = React.PropsWithChildren <{
  fields: FieldOption[]
}>

export default function FirstStepsForm({ fields }: Props) {
  // TODO -> corregir los textos de este formulario
  const [userType, setUserType] = useState<UserTypeEnum | null>(null)
  const [step, setStep] = useState<number>(0)

  const goNext = () => {
    if (step >= 4) return
    setStep(step + 1)
  }

  const goBack = () => {
    if (step <= 0) return
    setStep(step - 1)
  }

  return (
    <form className="mx-auto w-3/6 pt-10" onSubmit={e => { e.preventDefault() }} method="POST" action="/api/auth/signup">
      <StepIndicator step={step} />
      <Steps
        fields={fields}
        userType={userType}
        setUserType={setUserType}
        goBack={goBack}
        goNext={goNext}
        step={step}
      />
    </form>
  )
}
