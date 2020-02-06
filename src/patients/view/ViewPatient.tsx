import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, withRouter, Route, useHistory, useLocation } from 'react-router-dom'
import { Panel, Spinner, TabsHeader, Tab } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'

import useTitle from '../../page-header/useTitle'
import { fetchPatient } from '../patient-slice'
import { RootState } from '../../store'
import { getPatientFullName } from '../util/patient-name-util'
import Patient from '../../model/Patient'
import GeneralInformation from '../GeneralInformation'
import RelatedPerson from '../related-persons/RelatedPersonTab'

const getFriendlyId = (p: Patient): string => {
  if (p) {
    return p.friendlyId
  }

  return ''
}

const ViewPatient = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation()

  const { patient } = useSelector((state: RootState) => state.patient)

  useTitle(`${getPatientFullName(patient)} (${getFriendlyId(patient)})`)

  const { id } = useParams()
  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(id))
    }
  }, [dispatch, id])

  // this check doesn't work as an empty object isn't falsy. would it be more correct to display
  // the spinner when the Redux patient state isLoading is true?
  if (!patient) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      <TabsHeader>
        <Tab
          active={location.pathname === `/patients/${patient.id}`}
          label={t('patient.generalInformation')}
          onClick={() => history.push(`/patients/${patient.id}`)}
        />
        <Tab
          active={location.pathname === `/patients/${patient.id}/relatedpersons`}
          label={t('patient.relatedPersons.label')}
          onClick={() => history.push(`/patients/${patient.id}/relatedpersons`)}
        />
      </TabsHeader>
      <Panel>
        <Route exact path="/patients/:id">
          <GeneralInformation patient={patient} />
        </Route>
        <Route exact path="/patients/:id/relatedpersons">
          <RelatedPerson patient={patient} />
        </Route>
      </Panel>
    </div>
  )
}

export default withRouter(ViewPatient)
