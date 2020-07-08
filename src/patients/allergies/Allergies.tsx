import { Button, List, ListItem, Alert } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTranslator from '../../shared/hooks/useTranslator'
import Allergy from '../../shared/model/Allergy'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import NewAllergyModal from './NewAllergyModal'

interface AllergiesProps {
  patient: Patient
}

const Allergies = (props: AllergiesProps) => {
  const { t } = useTranslator()
  const { patient } = props
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showNewAllergyModal, setShowNewAllergyModal] = useState(false)

  const breadcrumbs = [
    {
      i18nKey: 'patient.allergies.label',
      location: `/patients/${patient.id}/allergies`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          {permissions.includes(Permissions.AddAllergy) && (
            <Button
              outlined
              color="success"
              icon="add"
              iconLocation="left"
              onClick={() => setShowNewAllergyModal(true)}
            >
              {t('patient.allergies.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      {(!patient.allergies || patient.allergies.length === 0) && (
        <Alert
          color="warning"
          title={t('patient.allergies.warning.noAllergies')}
          message={t('patient.allergies.addAllergyAbove')}
        />
      )}
      <List>
        {patient.allergies?.map((a: Allergy) => (
          <ListItem key={a.id}>{a.name}</ListItem>
        ))}
      </List>
      <NewAllergyModal
        show={showNewAllergyModal}
        onCloseButtonClick={() => setShowNewAllergyModal(false)}
      />
    </>
  )
}

export default Allergies
