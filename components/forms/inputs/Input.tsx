import { type SharedInputProps } from '@/lib/types'
import CustomLabel from './CustomLabel'
import clsx from 'clsx'
import { type HTMLInputTypeAttribute } from 'react'

type Props = React.PropsWithChildren<{
  onInput?: (event: OnInputEvent) => void
  placeholder: string
  innerIcon?: React.ReactElement
  type?: HTMLInputTypeAttribute
  step?: string
} & SharedInputProps>

// DRY 3
export default function Input({
  name, placeholder, label, register, step, config = {}, errors = {},
  type = 'text', value = '', className = '', children, onInput,
}: Props) {
  config.required = config.required !== undefined ? config.required : true
  const errorMessage = errors[name]?.message as string | undefined
  const hasError = errorMessage !== undefined
  const registerProps = register !== undefined ? { ...register(name, config) } : {}

  return (
    <>
      {label !== undefined && <CustomLabel id={name} label={label} />}
      <div className="relative">
        <input
          onInput={onInput} id={name} name={name} type={type} step={step}
          placeholder={placeholder} {...registerProps}
          className={clsx('input input-md mb-3 w-full border-neutral-300 bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary', hasError && 'border-error focus:ring-error', className)} defaultValue={value}

        />
        {children}
        {hasError && (
          <p className="-mt-3 text-sm font-semibold text-error">
            {errorMessage}
          </p>
        )}
      </div>
    </>
  )
}
