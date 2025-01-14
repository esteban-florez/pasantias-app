import UserCard from '@/components/internships/UserCard'
import { auth } from '@/lib/auth/pages'
import { statuses as translation } from '@/lib/translations'
import { type RecruitmentWithRelations } from '@/lib/types'
import Link from 'next/link'
import StatusDot from './StatusDot'
import UpdateRecruitmentStatus from './UpdateRecruitmentStatus'
import AcceptRecruitmentModal from '@/components/internships/AcceptRecruitmentModal'

type Props = React.PropsWithChildren<{
  recruitment: RecruitmentWithRelations
}>

export default async function RecruitmentRow({ recruitment }: Props) {
  const { type } = await auth.user()
  const { id, interested, internship, status, vacant } = recruitment
  const { grade, person } = internship
  const { job, company } = vacant

  const current = type === 'INSTITUTE' ? 'PERSON' : type
  const recruitmentType = interested === current ? 'Enviada' : 'Recibida'

  return (
    <tr>
      <td>
        {type === 'PERSON'
          ? (
            <UserCard
              user={company}
              link={`/home/company/${company.id}`}
              sm
            />
            )
          : (
            <UserCard
              user={person}
              link={`/home/person/${person.id}`}
              sm
            />
            )}
      </td>
      <td>{grade.title}</td>
      <td>
        {type === 'COMPANY'
          ? (
            <Link
              className="underline text-secondary font-semibold"
              href={`/home/companies/${company.id}/vacants/${vacant.id}`}
            >
              {job.title}
            </Link>
            )
          : (
            <span className="font-semibold">{job.title}</span>
            )}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <StatusDot status={status} />
          <span>{translation[status]}</span>
        </div>
      </td>
      <td>{recruitmentType}</td>
      <td>
        {recruitmentType === 'Recibida' && recruitment.status === 'PENDING'
          ? (
            <div className="flex gap-1">
              {type === 'COMPANY'
                ? (
                  <AcceptRecruitmentModal recruitmentId={recruitment.id} />
                  )
                : (
                  <UpdateRecruitmentStatus
                    recruitmentId={id}
                    status="ACCEPTED"
                  />
                  )}
              <UpdateRecruitmentStatus
                recruitmentId={id}
                status="REJECTED"
              />
            </div>
            )
          : (
            <p className="text-lg font-semibold text-center">-- --</p>
            )}
      </td>
    </tr>
  )
}
