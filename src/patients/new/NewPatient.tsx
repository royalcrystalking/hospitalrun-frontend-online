import { Button, Toast } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTitle from '../../page-header/title/useTitle'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import GeneralInformation from '../GeneralInformation'
import { createPatient } from '../patient-slice'

const breadcrumbs = [
  { i18nKey: 'patients.label', location: '/patients' },
  { i18nKey: 'patients.newPatient', location: '/patients/new' },
]

const NewPatient = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const dispatch = useDispatch()
  const { createError } = useSelector((state: RootState) => state.patient)

  const [patient, setPatient] = useState({} as Patient)

  useTitle(t('patients.newPatient'))
  useAddBreadcrumbs(breadcrumbs, true)

  const onCancel = () => {
    history.push('/patients')
  }

  const onSuccessfulSave = (newPatient: Patient) => {
    history.push(`/patients/${newPatient.id}`)
    Toast(
      'success',
      t('states.success'),
      `${t('patients.successfullyCreated')} ${newPatient.fullName}`,
    )
  }

  const onSave = () => {
    dispatch(createPatient(patient, onSuccessfulSave))
  }

  const onPatientChange = (newPatient: Partial<Patient>) => {
    setPatient(newPatient as Patient)
  }

  return (
    <div>
      <GeneralInformation
        patient={patient}
        isEditable
        onChange={onPatientChange}
        error={createError}
      />
      <div className="row float-right">
        <div className="btn-group btn-group-lg mt-3">
          <Button className="btn-save mr-2" color="success" onClick={onSave}>
            {t('actions.save')}
          </Button>
          <Button className="btn-cancel" color="danger" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewPatient
