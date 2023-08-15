import { UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import AvatarIcon from '../AvatarIcon'
import clsx from 'clsx'

interface Props {
  name: string
  email: string
  action?: 'Add' | 'Remove' | 'Show'
  onClick?: () => void
}

export default function Member({ name, email, action, onClick }: Props) {
  return (
    <div
      className={clsx({
        'group flex justify-between items-center gap-x-2 w-full px-4 py-1 transition-colors delay-150 duration-150 hover:bg-primary': true,
        'cursor-pointer border-t border-x last:border-b first:rounded-t-md last:rounded-b-md': action !== 'Show',
        'rounded-md cursor-default': action === 'Show',
      })}
      onClick={onClick}
    >
      <div className="flex items-center gap-x-4">
        <AvatarIcon username={name} className="transition-colors delay-75 duration-75 group-hover:bg-white group-hover:text-primary" />
        <p className="transition-colors delay-75 duration-75 group-hover:text-white">{email}</p>
      </div>
      {action === 'Add' && <UserPlusIcon className="hidden h-5 w-5 justify-self-end fill-white transition-colors delay-75 duration-75 group-hover:block" />}
      {action === 'Remove' && <UserMinusIcon className="hidden h-5 w-5 justify-self-end fill-white transition-colors delay-75 duration-75 group-hover:block" />}
    </div>
  )
}
