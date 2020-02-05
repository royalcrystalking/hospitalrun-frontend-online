import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import { mount, ReactWrapper } from 'enzyme'
import RelatedPersonTab from 'patients/related-persons/RelatedPersonTab'
import { Button, List, ListItem } from '@hospitalrun/components'
import NewRelatedPersonModal from 'patients/related-persons/NewRelatedPersonModal'
import { act } from '@testing-library/react'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import Permissions from 'model/Permissions'
import { mocked } from 'ts-jest/utils'
import * as patientSlice from '../../../patients/patient-slice'

const mockStore = createMockStore([thunk])

describe('Related Persons Tab', () => {
  let wrapper: ReactWrapper
  let history = createMemoryHistory()
  const setup = async (location: string, patient: Patient, user: any) => {
    history = createMemoryHistory()
    history.push(location)
    return mount(
      <Router history={history}>
        <Provider store={mockStore({ patient, user })}>
          <RelatedPersonTab patient={patient} />
        </Provider>
      </Router>,
    )
  }
  describe('Add New Related Person', () => {
    let patient: any
    let user: any

    beforeEach(async () => {
      patient = {
        id: '123',
        rev: '123',
      } as Patient

      user = {
        permissions: [Permissions.WritePatients, Permissions.ReadPatients],
      }
      // general test wrapper
      wrapper = await setup('/', patient, user)
    })

    it('should render a New Related Person button', () => {
      const newRelatedPersonButton = wrapper.find(Button)

      expect(newRelatedPersonButton).toHaveLength(1)
      expect(newRelatedPersonButton.text().trim()).toEqual('patient.relatedPersons.new')
    })

    it('should not render a New Related Person button if the user does not have write privileges for a patient', async () => {
      user = { permissions: [Permissions.ReadPatients] }

      wrapper = await setup('/', patient, user)
      const newRelatedPersonButton = wrapper.find(Button)
      expect(newRelatedPersonButton).toHaveLength(0)
    })

    it('should render a New Related Person modal', () => {
      const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)

      expect(newRelatedPersonModal.prop('show')).toBeFalsy()
      expect(newRelatedPersonModal).toHaveLength(1)
    })

    it('should show the New Related Person modal when the New Related Person button is clicked', () => {
      const newRelatedPersonButton = wrapper.find(Button)

      act(() => {
        ;(newRelatedPersonButton.prop('onClick') as any)()
      })

      wrapper.update()

      const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
      expect(newRelatedPersonModal.prop('show')).toBeTruthy()
    })

    it('should call update patient with the data from the modal', async () => {
      jest.spyOn(patientSlice, 'updatePatient')
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      const expectedRelatedPerson = { patientId: '123', type: 'type' }
      const expectedPatient = {
        ...patient,
        relatedPersons: [expectedRelatedPerson],
      }
      await act(async () => {
        wrapper = await setup('/', patient, user)
      }).then(() => {
        act(() => {
          const newRelatedPersonButton = wrapper.find(Button)
          const onClick = newRelatedPersonButton.prop('onClick') as any
          onClick()
        })

        wrapper.update()

        act(() => {
          const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
          const onSave = newRelatedPersonModal.prop('onSave') as any
          onSave(expectedRelatedPerson)
        })

        wrapper.update()

        expect(patientSlice.updatePatient).toHaveBeenCalledTimes(1)
        expect(patientSlice.updatePatient).toHaveBeenCalledWith(expectedPatient)
      })
    })

    it('should close the modal when the save button is clicked', () => {
      act(() => {
        const newRelatedPersonButton = wrapper.find(Button)
        const onClick = newRelatedPersonButton.prop('onClick') as any
        onClick()
      })

      wrapper.update()

      act(() => {
        const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
        const onSave = newRelatedPersonModal.prop('onSave') as any
        onSave({ patientId: '123', type: 'type' })
      })

      wrapper.update()

      const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
      expect(newRelatedPersonModal.prop('show')).toBeFalsy()
    })
  })

  describe('List', () => {
    const patient = {
      id: '123',
      rev: '123',
      relatedPersons: [{ patientId: '123', type: 'type' }],
    } as Patient

    const user = {
      permissions: [Permissions.WritePatients, Permissions.ReadPatients],
    }

    beforeEach(async () => {
      jest.spyOn(PatientRepository, 'find')
      mocked(PatientRepository.find).mockResolvedValue({ fullName: 'test test', id: '123001' } as Patient)

      await act(async () => {
        wrapper = await setup('/', patient, user)
      })

      wrapper.update()
    })

    it('should render a list of of related persons with their full name being displayed', () => {
      const list = wrapper.find(List)
      const listItems = wrapper.find(ListItem)

      expect(list).toHaveLength(1)
      expect(listItems).toHaveLength(1)
      expect(listItems.at(0).text()).toEqual('test test')
    })
    it('should navigate to related person patient profile on related person click', () => {
      const list = wrapper.find(List)
      const listItems = wrapper.find(ListItem)
      act(() => {
        ;(listItems.at(0).prop('onClick') as any)()
      })
      expect(list).toHaveLength(1)
      expect(listItems).toHaveLength(1)
      expect(history.location.pathname).toEqual('/patients/123001')
    })
  })
})
