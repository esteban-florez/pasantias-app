import CustomLabel from './CustomLabel'

type Props = React.PropsWithChildren<{
  name: string
  label: string
  value?: string
  multiple?: boolean
  noDefault?: boolean
}>

export default function Select({ name, label, value = '', multiple = false, noDefault = false, children }: Props) {
  // TODO -> hacer que reciba una prop "options" con las opciones en formato { value: 1, label: 'Label'}
  return (
    <>
      <CustomLabel id={name} label={label} />
      <select id={name} name={name} className="select select-md mb-3 w-full border-neutral-300 focus:ring focus:ring-primary" defaultValue={value} multiple={multiple}>
        {!noDefault && <option value="" disabled>Seleccionar...</option>}
        {children}
      </select>
    </>
  )
}
