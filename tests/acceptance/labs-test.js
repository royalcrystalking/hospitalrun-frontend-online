import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | labs', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /labs', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/labs');

  andThen(function() {
    assert.equal(currentURL(), '/labs');
    findWithAssert('a:contains(Requests)');
    findWithAssert('a:contains(Completed)');
    findWithAssert('a:contains(Create a new record?)');
    findWithAssert('button:contains(new lab)');
  });
  destroyDatabases();
});

test('Adding a new lab request', function(assert) {
  loadPouchDump('labs');
  authenticateUser();
  visit('/labs');

  click('button:contains(new lab)');

  andThen(function() {
    assert.equal(currentURL(), '/labs/edit/new');
  });

  fillIn('.test-patient-name .tt-input', 'Lennex Zinyando - P00017');
  triggerEvent('.test-patient-name .tt-input', 'input');
  triggerEvent('.test-patient-name .tt-input', 'blur');
  fillIn('.test-lab-type .tt-input', 'Chest Scan');
  fillIn('.test-result-input input', 'Chest is clear');
  fillIn('textarea', 'Dr test ordered another scan');
  click('button:contains(Add)');
  waitToAppear('.modal-dialog');

  andThen(() => {
    assert.equal(find('.modal-title').text(), 'Lab Request Saved', 'Lab Request was saved successfully');
    findWithAssert('.patient-summary');
  });

  click('.modal-footer button:contains(Ok)');

  andThen(() => {
    assert.equal(find('.patient-summary').length, 1, 'Patient summary is displayed');
  });

  click('.panel-footer button:contains(Return)');

  andThen(() => {
    assert.equal(currentURL(), '/labs');
    assert.equal(find('tr').length, 3, 'Two lab requests are displayed');
  });
  destroyDatabases();
});

test('Marking a lab request as completed', function(assert) {
  loadPouchDump('labs');
  authenticateUser();
  visit('/labs/completed');

  andThen(() => {
    assert.equal(find('.alert-info').text().trim(), 'No completed items found.', 'No completed requests are displayed');
  });

  visit('/labs');
  click('button:contains(Edit)');
  click('button:contains(Complete)');
  waitToAppear('.modal-dialog');

  andThen(function() {
    assert.equal(find('.modal-title').text(), 'Lab Request Completed', 'Lab Request was completed successfully');
  });

  click('.modal-footer button:contains(Ok)');
  click('.panel-footer button:contains(Return)');
  visit('/labs/completed');

  andThen(() => {
    assert.equal(find('tr').length, 2, 'One completed request is displayed');
  });
  destroyDatabases();
});
