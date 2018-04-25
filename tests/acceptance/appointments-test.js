import { test } from 'qunit';
import moment from 'moment';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

const DATE_TIME_FORMAT = 'l h:mm A';
const DATE_FORMAT = 'l';
const TIME_FORMAT = 'h:mm';

moduleForAcceptance('Acceptance | appointments');

test('visiting /appointments', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/appointments');
    andThen(function() {
      assert.equal(currentURL(), '/appointments');
      findWithAssert('button:contains(new appointment)');
      assert.dom('.table-header').exists();
    });
  });
});

test('visiting /appointments/missed', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    let url = '/appointments';
    let today = moment();
    let tomorrow = moment().add(1, 'days');
    let status = 'Missed';
    createAppointment(assert, {
      startDate: today,
      endDate: tomorrow,
      allDay: false,
      status
    });
    visit(url);
    andThen(function() {
      assert.equal(currentURL(), url);
      findWithAssert(`.appointment-status:contains(${status})`);
    });
  });
});

test('test appointment for today', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    visit('/appointments/today');
    assert.dom('.appointment-date').doesNotExist('should have 0 appointment today');
    visit('/appointments/edit/new');
    andThen(function() {
      assert.equal(currentURL(), '/appointments/edit/new');
      findWithAssert('button:contains(Cancel)');
      findWithAssert('button:contains(Add)');
    });

    createAppointment(assert);

    visit('/appointments/today');
    andThen(() => {
      assert.equal(currentURL(), '/appointments/today');
      assert.dom('.appointment-status').hasText('Scheduled', 'should have 1 appointment today');
    });
  });
});

test('Creating a new appointment', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    visit('/appointments/edit/new');

    andThen(function() {
      assert.equal(currentURL(), '/appointments/edit/new');
      findWithAssert('button:contains(Cancel)');
      findWithAssert('button:contains(Add)');
    });

    createAppointment(assert);

    andThen(() => {
      assert.equal(currentURL(), '/appointments');
      assert.dom('tr').exists({ count: 2 }, 'New appointment has been added');
      findWithAssert('button:contains(Check In)');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
    });
  });
});

test('Creating a new appointment from patient screen', function(assert) {
  runWithPouchDump('appointments', function() {
    let today = moment().startOf('day');
    let tomorrow =  moment(today).add(24, 'hours');
    authenticateUser();
    visit('/patients');
    andThen(function() {
      findWithAssert('button:contains(Edit)');
    });
    click('button:contains(Edit)');
    andThen(function() {
      assert.dom('button[data-test-selector="appointments-btn"]').exists({ count: 1 }, 'Tab Appointments shown AFTER clicking edit');
    });

    click('button[data-test-selector="appointments-btn"]');

    andThen(function() {
      assert.equal(currentURL().substr(0, 19), '/appointments/edit/', 'Creating appointment');
    });

    click('.appointment-all-day input');
    fillIn('.test-appointment-start input', today.format(DATE_FORMAT));
    fillIn('.test-appointment-end input', tomorrow.format(DATE_FORMAT));
    typeAheadFillIn('.test-appointment-location', 'Harare');
    typeAheadFillIn('.test-appointment-with', 'Dr Test');
    click('button:contains(Add)');

    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.dom('.modal-title').hasText('Appointment Saved', 'Appointment has been saved');
      click('.modal-footer button:contains(Ok)');
    });

    click('button:contains(Return)');
    andThen(() => {
      assert.equal(currentURL().substr(0, 15), '/patients/edit/', 'Back on patient edit screen');
    });
  });
});

test('Change appointment type', function(assert) {
  runWithPouchDump('appointments', function() {
    let today = moment().startOf('day');
    authenticateUser();
    visit('/appointments/edit/new');

    andThen(function() {
      assert.equal(currentURL(), '/appointments/edit/new');
      findWithAssert('button:contains(Cancel)');
      findWithAssert('button:contains(Add)');
    });

    createAppointment(assert);

    andThen(() => {
      assert.equal(currentURL(), '/appointments');
      assert.dom('tr').exists({ count: 2 }, 'New appointment has been added');
      findWithAssert('button:contains(Edit)');
    });

    click('button:contains(Edit)');

    andThen(() => {
      assert.equal(currentURL().substring(0, 19), '/appointments/edit/');
      assert.dom('.appointment-all-day input').hasValue('on', 'All day appointment is on');
    });

    select('.test-appointment-type', 'Clinic');

    andThen(() => {
      assert.dom('.test-appointment-date input').hasValue(today.format(DATE_FORMAT), 'Single date field found');
      assert.equal(find('.appointment-all-day').val(), '', 'All day appointment was turned off');
    });
  });
});

test('Checkin to a visit from appointment', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    createAppointment(assert);
    visit('/appointments');

    andThen(function() {
      assert.equal(currentURL(), '/appointments');
      assert.dom('tr').exists({ count: 2 }, 'New appointment has been added');
      findWithAssert('button:contains(Check In)');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
    });

    click('button:contains(Check In)');

    andThen(() => {
      assert.equal(currentURL(), '/visits/edit/checkin', 'Now in add visiting information route');
    });
    click('.panel-footer button:contains(Check In)');
    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.dom('.modal-title').hasText('Patient Checked In', 'Patient has been checked in');
    });
    click('button:contains(Ok)');
    andThen(() => {
      findWithAssert('button:contains(New Note)');
      findWithAssert('button:contains(New Procedure)');
      findWithAssert('button:contains(New Medication)');
      findWithAssert('button:contains(New Lab)');
      findWithAssert('button:contains(New Imaging)');
      findWithAssert('button:contains(New Vitals)');
      findWithAssert('button:contains(Add Item)');
    });
    click('button:contains(Return)');

    andThen(() => {
      assert.equal(currentURL(), '/appointments');
      assert.equal(find('button:contains(Check In)').length, 0, 'Check In button no longer appears');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
    });
  });
});

test('Delete an appointment', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    createAppointment(assert);
    visit('/appointments');

    andThen(function() {
      assert.equal(currentURL(), '/appointments');
      assert.dom('.appointment-date').exists({ count: 1 }, 'One appointment is listed');
      findWithAssert('button:contains(Check In)');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
      click('button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText(
        'Delete Appointment',
        'Delete Appointment confirmation modal has been displayed'
      );
      click('.modal-dialog button:contains(Delete)');
    });
    andThen(() => {
      waitToDisappear('.appointment-date');
    });
    andThen(() => {
      assert.dom('.appointment-date').doesNotExist('No appointments are displayed');
    });
  });
});

test('Appointment calendar', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    let today = moment().startOf('day');
    let later =  moment(today).add(1, 'hours');
    let startTime = today.format(TIME_FORMAT);
    let endTime = later.format(TIME_FORMAT);
    let timeString = `${startTime} - ${endTime}`;
    createAppointment(assert, {
      startDate: today,
      endDate: later,
      allDay: false,
      status: 'Scheduled'
    });

    andThen(function() {
      visit('/appointments/calendar');
    });

    andThen(function() {
      assert.equal(currentURL(), '/appointments/calendar');
      assert.dom('.view-current-title').hasText('Appointments Calendar', 'Appoinment Calendar displays');
      assert.dom('.fc-content .fc-time').hasText(timeString, 'Time appears in calendar');
      assert.dom('.fc-title').hasText('Lennex ZinyandoDr Test', 'Appoinment displays in calendar');
      click('.fc-title');
    });

    andThen(() => {
      assert.dom('.view-current-title').hasText('Edit Appointment', 'Edit Appointment displays');
      assert.dom('.test-appointment-start input').hasValue(today.format(DATE_TIME_FORMAT), 'Start date/time are correct');
      assert.dom('.test-appointment-end input').hasValue(later.format(DATE_TIME_FORMAT), 'End date/time are correct');
    });
  });
});

test('visiting /appointments/search', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();

    createAppointment(assert);
    createAppointment(assert, {
      startDate: moment().startOf('day').add(1, 'years'),
      startTime: moment().startOf('day').add(1, 'years').format(TIME_FORMAT),
      endDate: moment().endOf('day').add(1, 'years').add(2, 'days'),
      endTime: moment().endOf('day').add(1, 'years').add(2, 'days').format(TIME_FORMAT)
    });

    andThen(function() {
      visit('/appointments/search');
    });

    andThen(function() {
      findWithAssert(':contains(Search Appointments)');
      findWithAssert(':contains(Show Appointments On Or After)');
      findWithAssert(':contains(Status)');
      findWithAssert(':contains(Type)');
      findWithAssert(':contains(With)');
    });

    andThen(function() {
      let desiredDate = moment().endOf('day').add(363, 'days').format('l');
      let datePicker = '.test-selected-start-date input';
      selectDate(datePicker, desiredDate);
      click('button:contains(Search)');
    });

    andThen(function() {
      let date = moment().endOf('day').add(1, 'years').add(2, 'days').format('l');
      findWithAssert(`.appointment-status:contains(${status})`);
      let element = `tr:contains(${date})`;
      findWithAssert(element);
      date = moment().startOf('day').add(1, 'years');
      element = find(`tr:contains(${date})`);
      assert.equal(element.length, 0);
    });

  });
});

test('Theater scheduling', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    let later = moment();
    later.hour(11);
    later.minute(30);
    let today = moment();
    today.hour(10);
    today.minute(30);
    let startTime = today.format(TIME_FORMAT);
    let endTime = later.format(TIME_FORMAT);
    let timeString = `${startTime} - ${endTime}`;

    createAppointment(assert, {
      endDate: later,
      startDate: today,
      isSurgery: true
    });

    andThen(function() {
      visit('/appointments/theater');
    });

    andThen(function() {
      assert.equal(currentURL(), '/appointments/theater', 'Theater schedule url is correct.');
      assert.dom('.view-current-title').hasText('Theater Schedule', 'Theater Schedule displays');
      assert.dom('.fc-content .fc-time').hasText(timeString, 'Time appears in calendar');
      assert.dom('.fc-title').hasText('Lennex ZinyandoDr Test', 'Appoinment displays in calendar');
      click('.fc-title');
    });

    andThen(() => {
      assert.dom('.view-current-title').hasText('Edit Surgical Appointment', 'Edit Surgical Appointment displays');
      assert.dom('.test-appointment-date input').hasValue(today.format('l'), 'Date is correct');
      assert.dom('.start-hour').hasValue('10', 'Start hour is correct');
      assert.dom('.start-minute').hasValue('30', 'Start minute is correct');
      assert.dom('.end-hour').hasValue('11', 'End hour is correct');
      assert.dom('.end-minute').hasValue('30', 'End minute is correct');
    });
  });
});

function createAppointment(assert, appointment = { startDate: new Date(), endDate: moment().add(1, 'day').toDate(), allDay: true, status: 'Scheduled' }) {
  if (appointment.isSurgery) {
    visit('/appointments/edit/newsurgery');
  } else {
    visit('/appointments/edit/new');
  }
  typeAheadFillIn('.test-patient-input', 'Lennex Zinyando - P00017');
  if (appointment.isSurgery) {
    selectDate('.test-appointment-date input', appointment.startDate);
    let endHour = getHour(appointment.endDate);
    let endMinute = appointment.endDate.format('mm');
    let startHour = getHour(appointment.startDate);
    let startMinute = appointment.startDate.format('mm');
    select('.end-hour', endHour);
    select('.end-minute', endMinute);
    select('.start-hour', startHour);
    select('.start-minute', startMinute);
  } else {
    select('.test-appointment-status', appointment.status);
    if (!appointment.allDay) {
      click('.appointment-all-day input');
      fillIn('.test-appointment-start input', appointment.startDate.format(DATE_TIME_FORMAT));
      fillIn('.test-appointment-end input', appointment.endDate.format(DATE_TIME_FORMAT));
    } else {
      selectDate('.test-appointment-start input', appointment.startDate);
      selectDate('.test-appointment-end input', appointment.endDate);
    }
  }
  typeAheadFillIn('.test-appointment-location', 'Harare');
  typeAheadFillIn('.test-appointment-with', 'Dr Test');
  click('button:contains(Add)');
  waitToAppear('.modal-dialog');
  andThen(() => {
    assert.dom('.modal-title').hasText('Appointment Saved', 'Appointment has been saved');
    click('.modal-footer button:contains(Ok)');
  });
  andThen(() => {
    click('button:contains(Return)');
  });
}

function getHour(date) {
  let hour = date.format('h A');
  if (hour.indexOf('12') === 0) {
    if (hour === '12 AM') {
      hour = 'Midnight';
    } else {
      hour = 'Noon';
    }
  }
  return hour;
}
