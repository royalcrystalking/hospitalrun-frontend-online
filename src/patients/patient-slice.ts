import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Toast } from '@hospitalrun/components'
import Patient from '../model/Patient'
import PatientRepository from '../clients/db/PatientRepository'
import { AppThunk } from '../store'
import il8n from '../i18n'

interface PatientState {
  isLoading: boolean
  isUpdatedSuccessfully: boolean
  patient: Patient
  relatedPersons: Patient[]
}

const initialState: PatientState = {
  isLoading: false,
  isUpdatedSuccessfully: false,
  patient: {} as Patient,
  relatedPersons: [],
}

function startLoading(state: PatientState) {
  state.isLoading = true
}

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    getPatientStart: startLoading,
    createPatientStart: startLoading,
    updatePatientStart: startLoading,
    getPatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.isLoading = false
      state.patient = payload
    },
    createPatientSuccess(state) {
      state.isLoading = false
    },
    updatePatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.isLoading = false
      state.patient = payload
    },
  },
})

export const {
  getPatientStart,
  getPatientSuccess,
  createPatientStart,
  createPatientSuccess,
  updatePatientStart,
  updatePatientSuccess,
} = patientSlice.actions

export const fetchPatient = (id: string): AppThunk => async (dispatch) => {
  dispatch(getPatientStart())
  const patient = await PatientRepository.find(id)
  dispatch(getPatientSuccess(patient))
}

export const createPatient = (patient: Patient, history: any): AppThunk => async (dispatch) => {
  dispatch(createPatientStart())
  const newPatient = await PatientRepository.save(patient)
  dispatch(createPatientSuccess())
  history.push(`/patients/${newPatient.id}`)
  Toast(
    'success',
    il8n.t('Success!'),
    `${il8n.t('patients.successfullyCreated')} ${patient.givenName} ${patient.familyName} ${
      patient.suffix
    }`,
  )
}

export const updatePatient = (patient: Patient, history: any): AppThunk => async (dispatch) => {
  dispatch(updatePatientStart())
  const updatedPatient = await PatientRepository.saveOrUpdate(patient)
  dispatch(updatePatientSuccess(updatedPatient))
  history.push(`/patients/${updatedPatient.id}`)
  Toast(
    'success',
    il8n.t('Success!'),
    `${il8n.t('patients.successfullyUpdated')} ${patient.givenName} ${patient.familyName} ${
      patient.suffix
    }`,
  )
}

export default patientSlice.reducer
