import { type UseSubmitResult } from '@/lib/types'
import Toast from '../Toast'

const generic = 'Hubo un error al envíar los datos, por favor intenta de nuevo...'

const messages: Record<string, string> = {
  SUCCESS: '¡Los datos se enviaron correctamente!',
  VALIDATION: 'Existe un error en los datos, por favor verifícalos...',
  SERVER: 'Hubo un error en el servidor, intenta de nuevo más tarde...',
  RESPONSE_SYNTAX: generic,
  REQUEST_SYNTAX: generic,
  FETCH: generic,
} as const

interface AlertData {
  message: string
  type: 'loading' | 'success' | 'error'
}

type Props = React.PropsWithChildren<{
  result: UseSubmitResult
  reset: () => void
}>

export default function SubmitAlert({ result, reset }: Props) {
  if (result === null) {
    return null
  }

  const alert: AlertData = {
    message: 'Enviando datos...',
    type: 'loading',
  }

  if (result !== 'loading') {
    alert.message = messages[result.body.errorType ?? 'SUCCESS']
    alert.type = result.body.errorType !== undefined ? 'error' : 'success'
  }

  return (
    <Toast
      {...alert}
      onClose={reset}
    />
  )
}