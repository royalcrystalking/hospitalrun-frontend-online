import PricingIndexRoute from 'hospitalrun/pricing/index/route';
export default PricingIndexRoute.extend({
    category: 'Ward',
    pageTitle: 'Ward Pricing',
    
    actions: {
        editItem: function(item) {
            item.set('returnTo','pricing.imaging');
            this.transitionTo('pricing.edit', item);
        }
    }
});