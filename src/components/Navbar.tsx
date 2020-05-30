import { Navbar as HospitalRunNavbar } from '@hospitalrun/components'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Permissions from '../model/Permissions'
import { RootState } from '../store'

const Navbar = () => {
  const { permissions } = useSelector((state: RootState) => state.user)
  const { t } = useTranslation()
  const history = useHistory()

  const addPages = [
    {
      permission: Permissions.WritePatients,
      label: t('patients.newPatient'),
      path: '/patients/new',
    },
    {
      permission: Permissions.WriteAppointments,
      label: t('scheduling.appointments.new'),
      path: '/appointments/new',
    },
    {
      permission: Permissions.RequestLab,
      label: t('labs.requests.new'),
      path: '/labs/new',
    },
    {
      permission: Permissions.ReportIncident,
      label: t('incidents.reports.new'),
      path: '/incidents/new',
    },
  ]

  const addDropdownList: { type: string; label: string; onClick: () => void }[] = addPages
    .filter((page) => permissions.includes(page.permission))
    .map((page) => ({
      type: 'link',
      label: page.label,
      onClick: () => {
        history.push(page.path)
      },
    }))

  return (
    <HospitalRunNavbar
      bg="dark"
      variant="dark"
      navItems={[
        {
          type: 'image',
          src:
            'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53%0D%0AMy5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5r%0D%0AIiB2aWV3Qm94PSIwIDAgMjk5IDI5OSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOnVybCgjbGlu%0D%0AZWFyLWdyYWRpZW50KTt9PC9zdHlsZT48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVu%0D%0AdCIgeDE9IjcyLjU4IiB5MT0iMTYuMDQiIHgyPSIyMjcuMzEiIHkyPSIyODQuMDIiIGdyYWRpZW50%0D%0AVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAuMDEiIHN0b3AtY29sb3I9IiM2%0D%0AMGQxYmIiLz48c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iIzFhYmM5YyIvPjxzdG9wIG9m%0D%0AZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwOWI5ZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjx0%0D%0AaXRsZT5jcm9zcy1pY29uPC90aXRsZT48cGF0aCBpZD0iY3Jvc3MiIGNsYXNzPSJjbHMtMSIgZD0i%0D%0ATTI5Mi45NCw5Ny40NkgyMDUuM1Y3LjA2QTYuNTYsNi41NiwwLDAsMCwxOTguNzQuNUgxMDEuMjZB%0D%0ANi41Niw2LjU2LDAsMCwwLDk0LjcsNy4wNnY5MC40SDcuMDZBNi41OCw2LjU4LDAsMCwwLC41LDEw%0D%0ANFYxOTYuM2E2LjIzLDYuMjMsMCwwLDAsNi4yMyw2LjI0aDg4djkwLjRhNi41Niw2LjU2LDAsMCww%0D%0ALDYuNTYsNi41Nmg5Ny40OGE2LjU2LDYuNTYsMCwwLDAsNi41Ni02LjU2di05MC40aDg4YTYuMjMs%0D%0ANi4yMywwLDAsMCw2LjIzLTYuMjRWMTA0QTYuNTgsNi41OCwwLDAsMCwyOTIuOTQsOTcuNDZaIiB0%0D%0AcmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41IC0wLjUpIi8+PC9zdmc+',
          onClick: () => {
            history.push('/')
          },
          className: 'nav-icon',
        },
        {
          type: 'header',
          label: 'HospitalRun',
          onClick: () => {
            history.push('/')
          },
          className: 'nav-header',
        },
        {
          type: 'link-list',
          label: t('patients.label'),
          className: 'patients-link-list d-md-none d-block',
          children: [
            {
              type: 'link',
              label: t('actions.list'),
              onClick: () => {
                history.push('/patients')
              },
            },
            {
              type: 'link',
              label: t('actions.new'),
              onClick: () => {
                history.push('/patients/new')
              },
            },
          ],
        },
        {
          type: 'link-list',
          label: t('scheduling.label'),
          className: 'scheduling-link-list d-md-none d-block',
          children: [
            {
              type: 'link',
              label: t('scheduling.appointments.label'),
              onClick: () => {
                history.push('/appointments')
              },
            },
            {
              type: 'link',
              label: t('scheduling.appointments.new'),
              onClick: () => {
                history.push('/appointments/new')
              },
            },
          ],
        },
        {
          type: 'link-list',
          label: t('labs.label'),
          className: 'labs-link-list d-md-none d-block',
          children: [
            {
              type: 'link',
              label: t('labs.label'),
              onClick: () => {
                history.push('/labs')
              },
            },
            {
              type: 'link',
              label: t('labs.requests.new'),
              onClick: () => {
                history.push('/labs/new')
              },
            },
          ],
        },
        {
          type: 'search',
          placeholderText: t('actions.search'),
          className: 'ml-auto nav-search',
          buttonText: t('actions.search'),
          buttonColor: 'secondary',
          onClickButton: () => undefined,
          onChangeInput: () => undefined,
        },
        {
          type: 'link-list-icon',
          alignRight: true,
          children: addDropdownList,
          className: 'pl-4 add-new',
          iconClassName: 'align-bottom',
          label: 'Add',
          name: 'add',
          size: 'lg',
        },
        {
          type: 'link-list-icon',
          alignRight: true,
          children: [
            {
              type: 'link',
              label: t('settings.label'),
              onClick: () => {
                history.push('/settings')
              },
            },
          ],
          className: 'pl-2',
          iconClassName: 'align-bottom',
          label: 'Patient',
          name: 'patient',
          size: 'lg',
        },
      ]}
    />
  )
}
export default Navbar
