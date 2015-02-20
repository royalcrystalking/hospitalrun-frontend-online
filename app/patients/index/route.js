import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    modelName: 'patient',
    pageTitle: 'Patient Listing',
    
    _getStartKeyFromItem: function(item) {
        var displayId =item.get('displayId');
        return [displayId,'patient_'+item.get('id')];
    },
    
    _modelQueryParams: function() {
        var maxValue = this.get('maxValue');
        return {
            options: {
                startkey: [null, null],
                endkey: [maxValue, maxValue]
            },
            mapReduce: 'patient_by_display_id'
        };
    },
    
});