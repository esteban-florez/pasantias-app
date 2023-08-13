'use client'

import Filter from './Filter'
import { useState } from 'react'
import { type TabProp, type InputOnChange, type VisibilityFilter } from '@/lib/types'
import { type Membership, type Person, type Project } from '@prisma/client'
import List from './List'

interface Props {
  projects: Array<Project & {
    person: Person | null
    memberships: Array<Membership & {
      person: Person
    }>
  }>
  personalProjects: Array<Project & {
    person: Person | null
    memberships: Array<Membership & {
      person: Person
    }>
  }>
}

export default function PageContent({ projects, personalProjects }: Props) {
  const [tab, setTab] = useState<TabProp>('All')
  const [visibility, setVisibility] = useState<VisibilityFilter>('ALL')
  const [members, setMembers] = useState(0)
  const [title, setTitle] = useState('')

  const handleChange = (event: InputOnChange) => {
    const { name, value } = event.target

    if (name === 'title') {
      setTitle(value)
    }
    if (name === 'visibility' && (value === 'PRIVATE' || value === 'PUBLIC' || value === 'ALL')) setVisibility(value)
    if (name === 'members') {
      const newValue = parseInt(value)
      if (typeof newValue === 'number') {
        setMembers(newValue >= 0 ? newValue : 0)
      }
    }
  }

  const handleChangeTab = (tabOption?: TabProp) => {
    if (tabOption !== null && tabOption !== undefined) setTab(tabOption)
  }

  return (
    <>
      <Filter active={tab} onChange={handleChange} onTabClick={handleChangeTab} />
      <section className="mx-auto mb-4 w-full columns-1 gap-4 rounded-lg rounded-tl-none bg-white p-4">
        <List projects={tab === 'All' ? projects : personalProjects} visibility={visibility} members={members} title={title} />
      </section>
    </>
  )
}
