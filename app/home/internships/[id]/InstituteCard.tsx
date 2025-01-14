import UserCard from '@/components/internships/UserCard'

type Props = React.PropsWithChildren<{
  institute: {
    id: string
    name: string
    image: string | null
    location: {
      title: string
    }
  }
}>

export default function InstituteCard({ institute }: Props) {
  return (
    <>
      <h3 className="font-bold tracking-tighter text-2xl">
        Universidad de la pasantía
      </h3>
      <div className="mt-2" />
      <UserCard
        user={institute}
        subtitle={institute.location.title}
        link={`/home/institute/${institute.id}`}
      />
    </>
  )
}
