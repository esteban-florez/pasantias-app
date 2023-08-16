import { type SelectableField, type SelectableSkill } from '@/lib/types'
import { createContext } from 'react'
import { type FieldErrors, type RegisterOptions, type UseFormRegisterReturn } from 'react-hook-form'

interface SignUpContextType {
  register: (name: string, config?: RegisterOptions) => UseFormRegisterReturn
  errors: FieldErrors
  goNext: () => void
  goBack: () => void
  reset: () => void
  trigger: (fields?: string | string[]) => Promise<boolean>
  fields: SelectableField[]
  setFields: (fields: SelectableField[]) => void
  skills: SelectableSkill[]
  setSkills: (skills: SelectableSkill[]) => void
}

// @ts-expect-error -> Trust me TypeScript, this context will not be null.
export const SignUpContext = createContext<SignUpContextType>({})
