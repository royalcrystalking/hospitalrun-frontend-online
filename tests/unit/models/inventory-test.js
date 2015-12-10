import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('inventory', 'Unit | Model | inventory', {
  // Specify the other units that are required for this test.
  needs: ['model:inv-purchase', 'model:inv-location']
});

test('condition', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model, 'Model exists');

  Ember.run(() => {
    model.setProperties({
      quantity: 200,
      rank: 'A'
    });
  });
  assert.equal(model.get('condition'), 'good', 'Condition Should be good with given values');

  Ember.run(() => {
    model.set('quantity', 199);
  });
  assert.equal(model.get('condition'), 'average', 'Condition Should be average with new quantity');

  Ember.run(() => {
    model.set('rank', 'B');
  });
  assert.equal(model.get('condition'), 'good', 'Condition should be good again with new rank');

  Ember.run(() => {
    model.set('quantity', 49);
  });
  assert.equal(model.get('condition'), 'bad', 'Condition should be bad with new quantity');

  Ember.run(() => {
    model.set('rank', 'C');
  });
  assert.equal(model.get('condition'), 'average', 'Condition should be average again');
});
