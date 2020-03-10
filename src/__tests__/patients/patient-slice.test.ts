import '../../__mocks__/matchMediaMock'
import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'
import * as components from '@hospitalrun/components'

import patient, {
  fetchPatientStart,
  fetchPatientSuccess,
  fetchPatient,
  createPatientStart,
  createPatientSuccess,
  createPatient,
  updatePatientStart,
  updatePatientSuccess,
  updatePatient,
} from '../../patients/patient-slice'
import Patient from '../../model/Patient'
import PatientRepository from '../../clients/db/PatientRepository'

describe('patients slice', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('patient reducer', () => {
    it('should create the proper initial state with empty patients array', () => {
      const patientStore = patient(undefined, {} as AnyAction)
      expect(patientStore.isLoading).toBeFalsy()
      expect(patientStore.patient).toEqual({})
    })

    it('should handle the FETCH_PATIENT_START action', () => {
      const patientStore = patient(undefined, {
        type: fetchPatientStart.type,
      })

      expect(patientStore.isLoading).toBeTruthy()
    })

    it('should handle the FETCH_PATIENT_SUCCESS actions', () => {
      const expectedPatient = {
        id: '123',
        rev: '123',
        sex: 'male',
        dateOfBirth: new Date().toISOString(),
        givenName: 'test',
        familyName: 'test',
      }
      const patientStore = patient(undefined, {
        type: fetchPatientSuccess.type,
        payload: {
          ...expectedPatient,
        },
      })

      expect(patientStore.isLoading).toBeFalsy()
      expect(patientStore.patient).toEqual(expectedPatient)
    })

    it('should handle the CREATE_PATIENT_START action', () => {
      const patientsStore = patient(undefined, {
        type: createPatientStart.type,
      })

      expect(patientsStore.isLoading).toBeTruthy()
    })

    it('should handle the CREATE_PATIENT_SUCCESS actions', () => {
      const patientsStore = patient(undefined, {
        type: createPatientSuccess.type,
      })

      expect(patientsStore.isLoading).toBeFalsy()
    })

    it('should handle the UPDATE_PATIENT_START action', () => {
      const patientStore = patient(undefined, {
        type: updatePatientStart.type,
      })

      expect(patientStore.isLoading).toBeTruthy()
    })

    it('should handle the UPDATE_PATIENT_SUCCESS action', () => {
      const expectedPatient = {
        id: '123',
        rev: '123',
        sex: 'male',
        dateOfBirth: new Date().toISOString(),
        givenName: 'test',
        familyName: 'test',
      }
      const patientStore = patient(undefined, {
        type: updatePatientSuccess.type,
        payload: {
          ...expectedPatient,
        },
      })

      expect(patientStore.isLoading).toBeFalsy()
      expect(patientStore.patient).toEqual(expectedPatient)
    })
  })

  describe('createPatient()', () => {
    it('should dispatch the CREATE_PATIENT_START action', async () => {
      jest.spyOn(PatientRepository, 'save')
      mocked(PatientRepository).save.mockResolvedValue({ id: 'sliceId1' } as Patient)
      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedPatient = {
        id: 'sliceId1',
      } as Patient

      await createPatient(expectedPatient)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: createPatientStart.type })
    })

    it('should call the PatientRepository save method with the correct patient', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'save')
      mocked(PatientRepository).save.mockResolvedValue({ id: 'sliceId2' } as Patient)
      const expectedPatient = {
        id: 'sliceId2',
      } as Patient

      await createPatient(expectedPatient)(dispatch, getState, null)

      expect(PatientRepository.save).toHaveBeenCalledWith(expectedPatient)
    })

    it('should dispatch the CREATE_PATIENT_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.save.mockResolvedValue({ id: 'slideId3' } as Patient)
      const expectedPatient = {
        id: 'slideId3',
      } as Patient

      await createPatient(expectedPatient)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: createPatientSuccess.type })
    })

    it('should call the on success function', async () => {
      const onSuccessSpy = jest.fn()
      const expectedPatientId = 'sliceId5'
      const expectedFullName = 'John Doe II'
      const expectedPatient = {
        id: expectedPatientId,
        fullName: expectedFullName,
      } as Patient
      jest.spyOn(PatientRepository, 'save')
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.save.mockResolvedValue(expectedPatient)
      const dispatch = jest.fn()
      const getState = jest.fn()

      await createPatient(expectedPatient, onSuccessSpy)(dispatch, getState, null)

      expect(onSuccessSpy).toHaveBeenCalled()
      expect(onSuccessSpy).toHaveBeenCalledWith(expectedPatient)
    })
  })

  describe('fetchPatient()', () => {
    it('should dispatch the FETCH_PATIENT_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'find')
      const expectedPatientId = 'sliceId6'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.find.mockResolvedValue(expectedPatient)

      await fetchPatient(expectedPatientId)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: fetchPatientStart.type })
    })

    it('should call the PatientRepository find method with the correct patient id', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'find')
      const expectedPatientId = 'sliceId7'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.find.mockResolvedValue(expectedPatient)
      jest.spyOn(PatientRepository, 'find')

      await fetchPatient(expectedPatientId)(dispatch, getState, null)

      expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    })

    it('should dispatch the FETCH_PATIENT_SUCCESS action with the correct data', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'find')
      const expectedPatientId = 'sliceId8'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.find.mockResolvedValue(expectedPatient)

      await fetchPatient(expectedPatientId)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: fetchPatientSuccess.type,
        payload: {
          ...expectedPatient,
        },
      })
    })
  })

  describe('update patient', () => {
    it('should dispatch the UPDATE_PATIENT_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      const expectedPatientId = 'sliceId9'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.saveOrUpdate.mockResolvedValue(expectedPatient)

      await updatePatient(expectedPatient)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: updatePatientStart.type })
    })

    it('should call the PatientRepository saveOrUpdate function with the correct data', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      const expectedPatientId = 'sliceId10'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.saveOrUpdate.mockResolvedValue(expectedPatient)

      await updatePatient(expectedPatient)(dispatch, getState, null)

      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPatient)
    })

    it('should dispatch the UPDATE_PATIENT_SUCCESS action with the correct data', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      const expectedPatientId = 'sliceId11'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.saveOrUpdate.mockResolvedValue(expectedPatient)

      await updatePatient(expectedPatient)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: updatePatientSuccess.type,
        payload: expectedPatient,
      })
    })

    it('should call the onSuccess function', async () => {
      const onSuccessSpy = jest.fn()
      jest.spyOn(components, 'Toast')
      const expectedPatientId = 'sliceId11'
      const fullName = 'John Doe II'
      const expectedPatient = {
        id: expectedPatientId,
        fullName,
      } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.saveOrUpdate.mockResolvedValue(expectedPatient)
      const dispatch = jest.fn()
      const getState = jest.fn()

      await updatePatient(expectedPatient, onSuccessSpy)(dispatch, getState, null)

      expect(onSuccessSpy).toHaveBeenCalled()
      expect(onSuccessSpy).toHaveBeenCalledWith(expectedPatient)
    })
  })
})
