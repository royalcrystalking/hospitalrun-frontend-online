import '../../../../__mocks__/matchMediaMock'

import { Button } from '@hospitalrun/components'
import { roundToNearestMinutes, addMinutes } from 'date-fns'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import configureMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mocked } from 'ts-jest/utils'

import AppointmentRepository from '../../../../clients/db/AppointmentRepository'
import PatientRepository from '../../../../clients/db/PatientRepository'
import Appointment from '../../../../model/Appointment'
import Patient from '../../../../model/Patient'
import * as titleUtil from '../../../../page-header/useTitle'
import * as appointmentSlice from '../../../../scheduling/appointments/appointment-slice'
import AppointmentDetailForm from '../../../../scheduling/appointments/AppointmentDetailForm'
import EditAppointment from '../../../../scheduling/appointments/edit/EditAppointment'

const mockStore = configureMockStore([thunk])

describe('Edit Appointment', () => {
  const appointment = {
    id: '123',
    patientId: '456',
    startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
    endDateTime: addMinutes(roundToNearestMinutes(new Date(), { nearestTo: 15 }), 60).toISOString(),
    location: 'location',
    reason: 'reason',
    type: 'type',
  } as Appointment

  const patient = {
    id: '456',
    prefix: 'prefix',
    givenName: 'givenName',
    familyName: 'familyName',
    suffix: 'suffix',
    fullName: 'givenName familyName suffix',
    sex: 'male',
    type: 'charity',
    occupation: 'occupation',
    preferredLanguage: 'preferredLanguage',
    phoneNumber: 'phoneNumber',
    email: 'email@email.com',
    address: 'address',
    code: 'P00001',
    dateOfBirth: new Date().toISOString(),
  } as Patient

  let history: any
  let store: MockStore

  const setup = () => {
    jest.spyOn(AppointmentRepository, 'saveOrUpdate')
    jest.spyOn(AppointmentRepository, 'find')
    jest.spyOn(PatientRepository, 'find')

    const mockedAppointmentRepository = mocked(AppointmentRepository, true)
    mockedAppointmentRepository.find.mockResolvedValue(appointment)
    mockedAppointmentRepository.saveOrUpdate.mockResolvedValue(appointment)

    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.find.mockResolvedValue(patient)

    history = createMemoryHistory()
    store = mockStore({ appointment: { appointment, patient } })

    history.push('/appointments/edit/123')
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/appointments/edit/:id">
            <EditAppointment />
          </Route>
        </Router>
      </Provider>,
    )

    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should render an edit appointment form', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    expect(wrapper.find(AppointmentDetailForm)).toHaveLength(1)
  })

  it('should dispatch fetchAppointment when component loads', async () => {
    await act(async () => {
      await setup()
    })

    expect(AppointmentRepository.find).toHaveBeenCalledWith(appointment.id)
    expect(PatientRepository.find).toHaveBeenCalledWith(appointment.patientId)
    expect(store.getActions()).toContainEqual(appointmentSlice.fetchAppointmentStart())
    expect(store.getActions()).toContainEqual(
      appointmentSlice.fetchAppointmentSuccess({ appointment, patient }),
    )
  })

  it('should use the correct title', async () => {
    jest.spyOn(titleUtil, 'default')
    await act(async () => {
      await setup()
    })
    expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.editAppointment')
  })

  it('should dispatch updateAppointment when save button is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    expect(AppointmentRepository.saveOrUpdate).toHaveBeenCalledWith(appointment)
    expect(store.getActions()).toContainEqual(appointmentSlice.updateAppointmentStart())
    expect(store.getActions()).toContainEqual(
      appointmentSlice.updateAppointmentSuccess(appointment),
    )
  })

  it('should navigate to /appointments/:id when save is successful', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any

    await act(async () => {
      await onClick()
    })

    expect(history.location.pathname).toEqual('/appointments/123')
  })

  it('should navigate to /appointments/:id when cancel is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const cancelButton = wrapper.find(Button).at(1)
    const onClick = cancelButton.prop('onClick') as any
    expect(cancelButton.text().trim()).toEqual('actions.cancel')

    act(() => {
      onClick()
    })

    wrapper.update()
    expect(history.location.pathname).toEqual('/appointments/123')
  })
})
