import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractPagedController.extend(UserSession, {
    startKey: [],
    canAdd: function() {
        return this.currentUserCan('add_imaging');
    }.property(),
    
    canComplete: function() {
        return this.currentUserCan('complete_imaging');
    }.property()

});