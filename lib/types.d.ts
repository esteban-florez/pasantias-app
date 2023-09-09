import { type UseFormRegisterReturn, type FieldErrors, type RegisterOptions } from 'react-hook-form'
import { type ERRORS } from './errors/reference'
import {
  type Person, type Company, type Institute, type Category, type Skill,
  type Offer, type Location, type Project, type Task, type Participation,
  type Membership, type Subtask, type Team,
} from '@prisma/client'
import { type days } from './translations'

type Selectable<T> = T & {
  selected: boolean
}

type OptionSkill = Pick<Skill, 'id' | 'title'>
type OptionCategory = Pick<Category, 'id' | 'title'>
type OptionPerson = Pick<Person, 'id' | 'name' | 'email'>

type SelectableCategory = Selectable<OptionCategory>
type SelectableSkill = Selectable<OptionSkill>
type SelectablePerson = Selectable<OptionPerson>
type SelectableOption = OptionCategory | OptionSkill | OptionPerson

type Colors = 'PRIMARY' | 'SECONDARY' | 'ACCENT' | 'CANCEL' | 'EMPTY' | 'ERROR' | 'WHITE' | 'NEUTRAL'
type Styles = 'DEFAULT' | 'OUTLINE' | 'ICON' | 'TAB' | 'DISABLED'

// ----------------------------------------------------------------------
// --------------------------- Projects ---------------------------------
// ----------------------------------------------------------------------
type SuggestedOffersWithRelationships = Array<Offer & {
  company: {
    id: string
    name: string
  }
  location: {
    title: string
  }
  job: {
    id: string
    title: string
  }
  categories: Array<{
    id: string
    title: string
  }>
  skills: Array<{
    id: string
    title: string
  }>
}>

interface Offers extends Offer {
  company: Company
  location: Location
  categories: Category[]
}

// ----------------------------------------------------------------------
// --------------------------- Projects ---------------------------------
// ----------------------------------------------------------------------
type ProjectMemberships = Array<Membership & {
  person: {
    id: string
    name: string
  } | null
  company: {
    id: string
    name: string
  } | null
}>

type ProjectTeam = Team & {
  memberships: Array<Membership & {
    person: {
      id: string
      name: string
    } | null
    company: {
      id: string
      name: string
    } | null
  }>
}

interface ProjectWithTeamAndCategories extends Project {
  team: Team & {
    memberships: Array<Membership & {
      person: {
        id: string
        name: string
      } | null
      company: {
        id: string
        name: string
      } | null
    }>
  }
  categories: Array<{
    id: string
    title: string
  }>
}

interface ProjectsWithTeamCategoriesTaskAndSubtask extends Project {
  team: Team & {
    memberships: Array<Membership & {
      person: {
        id: string
        name: string
      } | null
      company: {
        id: string
        name: string
      } | null
    }>
  }
  categories: Array<{
    id: string
    title: string
  }>
  tasks: Array<Task & {
    subtasks: Subtask[]
    participations: Participation[]
  }>
}

interface ProjectsWithTeamAndMessages extends Project {
  team: Team & {
    memberships: Array<Membership & {
      person: {
        id: string
        name: string
      } | null
      company: {
        id: string
        name: string
      } | null
      messages: Message[]
    }>
  }
}

interface Projects extends Project {
  team: Team & {
    memberships: Array<Membership & {
      person: Person | null
    }>
  }
  categories: Category[]
  tasks: Array<Task & {
    subtasks: Subtask[]
    participations: Participation[]
  }>
}

type SharedInputProps = {
  label?: string
  className?: string
  value?: string
} & UseInputProps

interface UseInputProps {
  name: string
  register?: (name, config?: RegisterOptions) => UseFormRegisterReturn
  config?: RegisterOptions
  errors?: FieldErrors
}

type UseSubmitResult = null | 'loading' | ApiResponseBody

type TabProp = 'All' | 'Mine'
type TeamGroupTab = 'members' | 'add'
type ProjectDetailsTab = 'Files' | 'Tasks'
type OffersTab = 'All' | 'Mine' | 'Applied' | 'Suggested'

interface ApiResponseBody {
  errorType?: keyof typeof ERRORS
  errors?: {
    [x: string]: string[] | undefined
    [x: number]: string[] | undefined
    [x: symbol]: string[] | undefined
  }
  data?: Record<string, unknown>
}

type Schedule = Record<keyof typeof days, number[]>

type OffersWithRelationships = Offer & {
  company: Company
  location: Location
  categories: Category[]
}

type UserWithType = (Person & { type: 'PERSON' })
| (Company & { type: 'COMPANY' })
| (Institute & { type: 'INSTITUTE' })
