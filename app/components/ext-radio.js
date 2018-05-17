import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
export default Component.extend({
  includeOtherOption: false,
  otherOptionLabel: null,
  showInline: false,

  haveLabel: function() {
    let firstRadio = this.get('content.firstObject');
    return !isEmpty(firstRadio.label);
  }.property('content'),

  radioClass: function() {
    if (this.get('showInline')) {
      return 'radio-inline';
    } else {
      return 'radio';
    }
  }.property('showInline')
});
