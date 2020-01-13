import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Spinner, TextInput, Button, List, ListItem, Container, Row } from '@hospitalrun/components'
import { RootState } from '../../store'
import { fetchPatients, searchPatients } from '../patients-slice'
import useTitle from '../../page-header/useTitle'

const Patients = () => {
  const { t } = useTranslation()
  const history = useHistory()
  useTitle(t('patients.label'))
  const dispatch = useDispatch()
  const { patients, isLoading } = useSelector((state: RootState) => state.patients)

  const [searchText, setSearchText] = useState<string>('')

  useEffect(() => {
    dispatch(fetchPatients())
  }, [dispatch])

  if (isLoading) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  const list = (
    <ul>
      {patients.map((p) => (
        <ListItem action key={p.id} onClick={() => history.push(`/patients/${p.id}`)}>
          {p.fullName} ({p.friendlyId})
        </ListItem>
      ))}
    </ul>
  )

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const onSearchFormSubmit = (event: React.FormEvent | React.MouseEvent) => {
    event.preventDefault()
    dispatch(searchPatients(searchText))
  }

  return (
    <Container>
      <form className="form-inline" onSubmit={onSearchFormSubmit}>
        <div className="input-group" style={{ width: '100%' }}>
          <TextInput
            size="lg"
            value={searchText}
            placeholder={t('actions.search')}
            onChange={onSearchBoxChange}
          />
          <div className="input-group-append">
            <Button onClick={onSearchFormSubmit}>{t('actions.search')}</Button>
          </div>
        </div>
      </form>

      <Row>
        <List layout="flush" style={{ width: '100%', marginTop: '10px', marginLeft: '-25px' }}>
          {list}
        </List>
      </Row>
    </Container>
  )
}

export default Patients
