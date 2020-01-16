import React from 'react'
import { Panel } from '@hospitalrun/components'
import { differenceInYears } from 'date-fns'
import Patient from 'model/Patient'
import { useTranslation } from 'react-i18next'
import TextFieldWithLabelFormGroup from '../../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import SelectWithLabelFormGroup from '../../components/input/SelectWithLableFormGroup'
import DatePickerWithLabelFormGroup from '../../components/input/DatePickerWithLabelFormGroup'

interface Props {
  patient: Patient
}

const getPatientAge = (dateOfBirth: string | undefined): string => {
  if (!dateOfBirth) {
    return ''
  }

  const dob = new Date(dateOfBirth)
  return differenceInYears(new Date(), dob).toString()
}

const getPatientDateOfBirth = (dateOfBirth: string | undefined): Date | undefined => {
  if (!dateOfBirth) {
    return undefined
  }

  return new Date(dateOfBirth)
}

const GeneralInformation = (props: Props) => {
  const { t } = useTranslation()
  const { patient } = props
  return (
    <div>
      <Panel title={t('patient.basicInformation')} color="primary" collapsible>
        <div className="row">
          <div className="col">
            <SelectWithLabelFormGroup
              name="sex"
              label={t('patient.sex')}
              value={patient.sex}
              isEditable={false}
              options={[
                { label: t('sex.male'), value: 'male' },
                { label: t('sex.female'), value: 'female' },
                { label: t('sex.other'), value: 'other' },
                { label: t('sex.unknown'), value: 'unknown' },
              ]}
            />
          </div>
          <div className="col">
            <SelectWithLabelFormGroup
              name="type"
              label={t('patient.type')}
              value={patient.type}
              isEditable={false}
              options={[
                { label: t('patient.types.charity'), value: 'charity' },
                { label: t('patient.types.private'), value: 'private' },
              ]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={
                patient.isApproximateDateOfBirth ? t('patient.approximateAge') : t('patient.age')
              }
              name="age"
              value={getPatientAge(patient.dateOfBirth)}
              isEditable={false}
            />
          </div>
          <div className="col-md-6">
            <DatePickerWithLabelFormGroup
              label={
                patient.isApproximateDateOfBirth
                  ? t('patient.approximateDateOfBirth')
                  : t('patient.dateOfBirth')
              }
              name="dateOfBirth"
              value={getPatientDateOfBirth(patient.dateOfBirth)}
              isEditable={false}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={t('patient.occupation')}
              name="occupation"
              value={patient.occupation}
              isEditable={false}
            />
          </div>
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={t('patient.preferredLanguage')}
              name="preferredLanguage"
              value={patient.preferredLanguage}
              isEditable={false}
            />
          </div>
        </div>
      </Panel>
      <br />
      <Panel title={t('patient.contactInformation')} color="primary" collapsible>
        <div className="row">
          <div className="col">
            <TextInputWithLabelFormGroup
              label={t('patient.phoneNumber')}
              name="phoneNumber"
              value={patient.phoneNumber}
              isEditable={false}
            />
          </div>
          <div className="col">
            <TextInputWithLabelFormGroup
              label={t('patient.email')}
              placeholder="email@email.com"
              name="email"
              value={patient.email}
              isEditable={false}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextFieldWithLabelFormGroup
              label={t('patient.address')}
              name="address"
              value={patient.address}
              isEditable={false}
            />
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default GeneralInformation
