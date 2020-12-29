import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import React from 'react'

import SearchPatients from '../../../patients/search/SearchPatients'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('Search Patients', () => {
  const dateOfBirth = new Date(2010, 1, 1, 1, 1, 1, 1)
  const expectedPatient = {
    id: '123',
    givenName: 'givenName',
    familyName: 'familyName',
    code: 'test code',
    sex: 'sex',
    dateOfBirth: dateOfBirth.toISOString(),
  } as Patient

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render a patient search input', () => {
    jest.spyOn(PatientRepository, 'search').mockResolvedValueOnce([])
    render(<SearchPatients />)

    expect(screen.getByPlaceholderText(/actions\.search/i)).toBeInTheDocument()
  })

  it('should render a view patients table', async () => {
    jest.spyOn(PatientRepository, 'search').mockResolvedValueOnce([])
    render(<SearchPatients />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /patients\.nopatients/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /patients\.newpatient/i })).toBeInTheDocument()
    })
  })

  it('should update view patients table search request when patient search input changes', async () => {
    const countSpyOn = jest
      .spyOn(PatientRepository, 'count')
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(1)

    const searchSpyOn = jest
      .spyOn(PatientRepository, 'search')
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([expectedPatient])

    const expectedSearch = 'someQueryString'
    render(<SearchPatients />)

    const patientSearch = screen.getByPlaceholderText(/actions\.search/i)
    userEvent.type(patientSearch, expectedSearch)
    expect(patientSearch).toHaveDisplayValue(expectedSearch)

    await waitFor(() => {
      expect(searchSpyOn).toHaveBeenCalledTimes(2)
      expect(searchSpyOn).toHaveBeenCalledWith(expectedSearch)
    })

    expect(screen.getByRole('cell', { name: expectedPatient.code })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: expectedPatient.givenName })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: expectedPatient.familyName })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: expectedPatient.sex })).toBeInTheDocument()
    expect(
      screen.getByRole('cell', { name: format(dateOfBirth, 'MM/dd/yyyy') }),
    ).toBeInTheDocument()

    searchSpyOn.mockReset()
    searchSpyOn.mockRestore()

    countSpyOn.mockReset()
    countSpyOn.mockRestore()
  })
})
