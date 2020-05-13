import '../../../__mocks__/matchMediaMock'
import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as components from '@hospitalrun/components'
import format from 'date-fns/format'
import { act } from 'react-dom/test-utils'
import LabsTab from '../../../patients/labs/LabsTab'
import Patient from '../../../model/Patient'
import Lab from '../../../model/Lab'
import Permissions from '../../../model/Permissions'
import LabRepository from '../../../clients/db/LabRepository'

const expectedPatient = {
  id: '123',
} as Patient

const labs = [
  {
    id: 'labId',
    patientId: '123',
    type: 'type',
    status: 'requested',
    requestedOn: new Date().toISOString(),
  } as Lab,
]

const mockStore = configureMockStore([thunk])
const history = createMemoryHistory()

let user: any
let store: any

const setup = (patient = expectedPatient, permissions = [Permissions.WritePatients]) => {
  user = { permissions }
  store = mockStore({ patient, user })
  jest.spyOn(LabRepository, 'findAllByPatientId').mockResolvedValue(labs)
  const wrapper = mount(
    <Router history={history}>
      <Provider store={store}>
        <LabsTab patientId={patient.id} />
      </Provider>
    </Router>,
  )

  return wrapper
}

describe('Labs Tab', () => {
  it('should list the patients labs', async () => {
    const expectedLabs = labs
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })
    wrapper.update()

    const table = wrapper.find('table')
    const tableHeader = wrapper.find('thead')
    const tableHeaders = wrapper.find('th')
    const tableBody = wrapper.find('tbody')
    const tableData = wrapper.find('td')

    expect(table).toHaveLength(1)
    expect(tableHeader).toHaveLength(1)
    expect(tableBody).toHaveLength(1)
    expect(tableHeaders.at(0).text()).toEqual('labs.lab.type')
    expect(tableHeaders.at(1).text()).toEqual('labs.lab.requestedOn')
    expect(tableHeaders.at(2).text()).toEqual('labs.lab.status')
    expect(tableData.at(0).text()).toEqual(expectedLabs[0].type)
    expect(tableData.at(1).text()).toEqual(
      format(new Date(expectedLabs[0].requestedOn), 'yyyy-MM-dd hh:mm a'),
    )
    expect(tableData.at(2).text()).toEqual(expectedLabs[0].status)
  })

  it('should render a warning message if the patient does not have any labs', async () => {
    let wrapper: any

    await act(async () => {
      wrapper = await setup({ ...expectedPatient })
    })

    const alert = wrapper.find(components.Alert)

    expect(alert).toHaveLength(1)
    expect(alert.prop('title')).toEqual('patient.labs.warning.noLabs')
    expect(alert.prop('message')).toEqual('patient.labs.noLabsMessage')
  })
})
