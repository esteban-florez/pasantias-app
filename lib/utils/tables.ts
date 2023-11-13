import { type Visibility, type Team, type Person, type Leader, type Company, type Membership, type Resets, type AuthUser, type Admin, type Institute, type Status, type Interested } from '@prisma/client'
import { DBError } from '../errors/reference'
import { type UserWithType, type ProjectsFull, type InternshipWithRelations, type MembershipsFull, type VacantWithRelations, type HiringWithPersonSkills } from '../types'

type TeamWithRelations = Team & {
  leader: Leader & {
    person: Person | null
    company: Company | null
  }
}

type TeamWithMembers = (Team & {
  leader: Leader & {
    person: Person | null
    company: Company | null
  }
  memberships: Array<Membership & {
    person: Person | null
  }>
}) | null

export function getHiringData(hirings: HiringWithPersonSkills[], id: string) {
  const status = getHiringStatusFromId(hirings, id)
  const hasApplied = hirings.some((hiring) => hiring.personId === id)
  const interested: Interested = hirings.find((hiring) => hiring.personId === id)?.interested
  const hiringId = hirings.find(hiring => hiring.personId === id)?.id ?? ''
  return { status, hasApplied, interested, hiringId }
}

export function getHiringStatusFromId(hirings: HiringWithPersonSkills[], id: string): Status {
  return hirings.find((hiring) => hiring.personId === id)?.status ?? 'PENDING'
}

export function belongsToTeam(team: TeamWithMembers, userId: string): boolean {
  if (team !== null) {
    return team.memberships.find(member => member.person?.id === userId) != null
  }

  return false
}

export function getMember(membership: MembershipsFull) {
  const member = membership.person

  if (member === null) {
    throw new DBError('DBError: Invalid membership without Person and Company.')
  }

  return member
}

export function getProjectLeader(project: ProjectsFull): UserWithType {
  const { person, team } = project

  if (person !== null) {
    return { ...person, type: 'PERSON' }
  }

  if (team !== null) {
    return getTeamLeader(team)
  }

  throw new DBError('DBError: Invalid Project without leader.')
}

export function getTeamLeader(team: TeamWithRelations): UserWithType {
  if (team !== null) {
    const { leader: { person, company } } = team
    if (person !== null) {
      return { ...person, type: 'PERSON' }
    } else if (company !== null) {
      return { ...company, type: 'COMPANY' }
    }
  }

  throw new DBError('DBError: Invalid Team without leader.')
}

export function getPublicProjects<T>(projects: Array<T & {
  visibility: Visibility
}>) {
  return projects.filter(project => project.visibility === 'PUBLIC')
}

export function getInternshipStage(internship: InternshipWithRelations) {
  const { status, completed, hours } = internship

  let stage: Stage = status

  if (status === 'ACCEPTED') {
    if (completed >= hours) {
      stage = 'COMPLETED'
    }

    const recruitment = getAcceptedRecruitment(internship)

    if (recruitment !== undefined) {
      stage = 'ACTIVE'
    }
  }

  return stage
}

export function getAcceptedRecruitment(internship: InternshipWithRelations) {
  return internship.recruitments.find(recruitment => recruitment.status === 'ACCEPTED')
}

export function getInternshipCompany(internship: InternshipWithRelations) {
  const accepted = getAcceptedRecruitment(internship)

  if (accepted === undefined) return null

  return accepted.vacant.company
}

interface ResetWithRelations extends Resets {
  authUser: AuthUser & {
    person: Person | null
    company: Company | null
    institute: Institute | null
    admin: Admin | null
  }
}

export function getResetEmail(reset: ResetWithRelations) {
  const { person, company, admin, institute } = reset.authUser
  const email = person?.email ?? company?.email ?? admin?.email ?? institute?.email
  if (email === undefined) {
    throw new Error('error: WATAFAAAK')
  }
  return email
}

type DateAndDuration = Pick<VacantWithRelations, 'createdAt' | 'duration'>
type Limitable = Pick<VacantWithRelations, 'recruitments' | 'limit'>
type WithRecruitments = Pick<VacantWithRelations, 'recruitments'>

export function vacantIsFull(vacant: Limitable) {
  const { length } = getAcceptedRecruitments(vacant)
  return length >= vacant.limit
}

export function vacantIsExpired(vacant: DateAndDuration) {
  return Date.now() >= Number(getVacantExpiration(vacant))
}

export function getVacantExpiration(vacant: DateAndDuration) {
  const createdAt = Number(vacant.createdAt)
  const duration = vacant.duration * 24 * 60 * 60 * 1000
  return new Date(createdAt + duration)
}

export function getAcceptedRecruitments(vacant: WithRecruitments) {
  return vacant.recruitments.filter(({ status }) => status === 'ACCEPTED')
}
