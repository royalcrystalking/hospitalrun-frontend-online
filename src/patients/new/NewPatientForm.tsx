import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Checkbox } from '@hospitalrun/components'
import { startOfDay, subYears } from 'date-fns'
import SelectWithLabelFormGroup from '../../components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import DatePickerWithLabelFormGroup from '../../components/input/DatePickerWithLabelFormGroup'
import Patient from '../../model/Patient'
import { getPatientName } from '../util/patient-name-util'

interface Props {
  onCancel: () => void
  onSave: (patient: Patient) => void
}

const NewPatientForm = (props: Props) => {
  const { t } = useTranslation()
  const [isEditable] = useState(true)
  const { onCancel, onSave } = props
  const [approximateAge, setApproximateAge] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [patient, setPatient] = useState({
    givenName: '',
    familyName: '',
    suffix: '',
    prefix: '',
    dateOfBirth: '',
    isApproximateDateOfBirth: false,
    sex: '',
    phoneNumber: '',
    email: '',
    address: '',
    preferredLanguage: '',
    occupation: '',
    type: '',
    fullName: '',
  })

  const onSaveButtonClick = async () => {
    if (!patient.givenName) {
      setErrorMessage(t('patient.errors.patientGivenNameRequired'))
    } else {
      const newPatient = {
        prefix: patient.prefix,
        familyName: patient.familyName,
        givenName: patient.givenName,
        suffix: patient.suffix,
        sex: patient.sex,
        dateOfBirth: patient.dateOfBirth,
        isApproximateDateOfBirth: patient.isApproximateDateOfBirth,
        type: patient.type,
        occupation: patient.occupation,
        preferredLanguage: patient.preferredLanguage,
        phoneNumber: patient.phoneNumber,
        email: patient.email,
        address: patient.address,
        fullName: getPatientName(patient.givenName, patient.familyName, patient.suffix),
      } as Patient

      onSave(newPatient)
    }
  }

  const onFieldChange = (key: string, value: string) => {
    setPatient({
      ...patient,
      [key]: value,
    })
  }

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, fieldName: string) => {
    onFieldChange(fieldName, event.target.value)
  }

  const onDateOfBirthChange = (date: Date) => {
    onFieldChange('dateOfBirth', date.toISOString())
  }

  const onInputElementChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    onFieldChange(fieldName, event.target.value)
  }

  const onApproximateAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let approximateAgeNumber
    if (Number.isNaN(parseFloat(event.target.value))) {
      approximateAgeNumber = 0
    } else {
      approximateAgeNumber = parseFloat(event.target.value)
    }

    setApproximateAge(approximateAgeNumber)
    const approximateDateOfBirth = subYears(new Date(), approximateAgeNumber)
    setPatient({ ...patient, dateOfBirth: startOfDay(approximateDateOfBirth).toISOString() })
  }

  return (
    <div>
      <form>
        <h3>{t('patient.basicInformation')}</h3>
        {errorMessage && <Alert className="alert" color="danger" message={errorMessage} />}
        <div className="row">
          <div className="col-md-2">
            <TextInputWithLabelFormGroup
              label={t('patient.prefix')}
              name="prefix"
              value={patient.prefix}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'prefix')
              }}
            />
          </div>
          <div className="col-md-4">
            <TextInputWithLabelFormGroup
              label={t('patient.givenName')}
              name="givenName"
              value={patient.givenName}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'givenName')
              }}
            />
          </div>
          <div className="col-md-4">
            <TextInputWithLabelFormGroup
              label={t('patient.familyName')}
              name="familyName"
              value={patient.familyName}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'familyName')
              }}
            />
          </div>
          <div className="col-md-2">
            <TextInputWithLabelFormGroup
              label={t('patient.suffix')}
              name="suffix"
              value={patient.suffix}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'suffix')
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <SelectWithLabelFormGroup
              name="sex"
              label={t('patient.sex')}
              value={patient.sex}
              isEditable={isEditable}
              options={[
                { label: t('sex.male'), value: 'male' },
                { label: t('sex.female'), value: 'female' },
                { label: t('sex.other'), value: 'other' },
                { label: t('sex.unknown'), value: 'unknown' },
              ]}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                onSelectChange(event, 'sex')
              }}
            />
          </div>
          <div className="col">
            <SelectWithLabelFormGroup
              name="type"
              label={t('patient.type')}
              value={patient.type}
              isEditable={isEditable}
              options={[
                { label: t('patient.types.charity'), value: 'charity' },
                { label: t('patient.types.private'), value: 'private' },
              ]}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                onSelectChange(event, 'type')
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <DatePickerWithLabelFormGroup
              name="dateOfBirth"
              label={t('patient.dateOfBirth')}
              isEditable={isEditable && !patient.isApproximateDateOfBirth}
              value={patient.dateOfBirth.length > 0 ? new Date(patient.dateOfBirth) : undefined}
              onChange={(date: Date) => {
                onDateOfBirthChange(date)
              }}
            />
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <Checkbox
                label={t('patient.unknownDateOfBirth')}
                name="unknown"
                onChange={(event) => {
                  setPatient({ ...patient, isApproximateDateOfBirth: event.target.checked })
                }}
              />
            </div>
          </div>
          {patient.isApproximateDateOfBirth && (
            <div className="col-md-6">
              <TextInputWithLabelFormGroup
                label={t('patient.approximateAge')}
                name="approximateAge"
                type="number"
                value={`${approximateAge}`}
                isEditable={isEditable}
                onChange={onApproximateAgeChange}
              />
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={t('patient.occupation')}
              name="occupation"
              value={patient.occupation}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'occupation')
              }}
            />
          </div>
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={t('patient.preferredLanguage')}
              name="preferredLanguage"
              value={patient.preferredLanguage}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'preferredLanguage')
              }}
            />
          </div>
        </div>

        <h3>{t('patient.contactInformation')}</h3>
        <div className="row">
          <div className="col">
            <TextInputWithLabelFormGroup
              label={t('patient.phoneNumber')}
              name="phoneNumber"
              value={patient.phoneNumber}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'phoneNumber')
              }}
            />
          </div>
          <div className="col">
            <TextInputWithLabelFormGroup
              label={t('patient.email')}
              placeholder="email@email.com"
              name="email"
              value={patient.email}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'email')
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextFieldWithLabelFormGroup
              label={t('patient.address')}
              name="address"
              value={patient.address}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                onFieldChange('address', event.currentTarget.value)
              }}
            />
          </div>
        </div>
        {isEditable && (
          <div className="row float-right">
            <div className="btn-group btn-group-lg">
              <Button className="mr-2" color="success" onClick={onSaveButtonClick}>
                {t('actions.save')}
              </Button>
              <Button color="danger" onClick={() => onCancel()}>
                {t('actions.cancel')}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default NewPatientForm
