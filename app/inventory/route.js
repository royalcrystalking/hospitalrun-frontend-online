import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import FulfillRequest from "hospitalrun/mixins/fulfill-request";
import InventoryLocations from "hospitalrun/mixins/inventory-locations"; //inventory-locations mixin is needed for fulfill-request mixin!
export default AbstractModuleRoute.extend(FulfillRequest, InventoryLocations, {
    additionalModels: [{ 
        name: 'aisleLocationList',
        findArgs: ['lookup','aisle_location_list']
    }, {
        name: 'deliveryLocationList',
        findArgs: ['lookup','delivery_location_list']
    }, {
        name: 'expenseAccountList',
        findArgs: ['lookup','expense_account_list']
    }, {
        name: 'warehouseList',
        findArgs: ['lookup','warehouse_list']
    }
  ],
    
    currentItem: null,
    modelName: 'inventory',
    moduleName: 'inventory',
    newButtonAction: 'newRequest',
    newButtonText: '+ new request',
    subActions: [{
        text: 'Requests',
        linkTo: 'inventory.index'
    }, {
        text: 'Items',
        linkTo: 'inventory.listing'
    }, {
        text: 'History',
        linkTo: 'inventory.completed'
    }],
    sectionTitle: 'Inventory',
    
    actions: {
        addPurchase: function(newPurchase) {
            var currentItem = this.get('currentItem'),
                purchases = currentItem.get('purchases');
            purchases.addObject(newPurchase);
            this.newPurchaseAdded(currentItem, newPurchase); 
            currentItem.updateQuantity();
            currentItem.save();
            this.send('closeModal');
        },
        
        newRequest: function() {
            var newId = this.generateId();
            var data = this.getNewData();
            if (newId) {
                data.id = newId;
            }
            var item = this.get('store').createRecord('inv-request', {
                transactionType: 'Request'
            });            
            this.transitionTo('inventory.request', item);
        },    
        
        allItems: function() {
            this.transitionTo('inventory.listing');
        },                

        newDelivery: function() {
            var item = this.get('store').createRecord('inv-request', {
                dateCompleted: new Date(),
                transactionType: 'Delivery'
            });            
            this.transitionTo('inventory.delivery', item);
        },
        
        showAddPurchase: function(inventoryItem) {
            var newPurchase = this.get('store').createRecord('inv-purchase', {
                distributionUnit: inventoryItem.get('distributionUnit')
            });            
            this.set('currentItem', inventoryItem);
            this.send('openModal', 'inventory.purchase.edit', newPurchase);
        }        

    },
    
    /**
     * Calculate a new id based on time stamp and randomized number
     * @return a generated id in base 36 so that its a shorter barcode.
     */
    generateId: function() {
        var min = 1,
            max = 999,
            part1 = new Date().getTime(),
            part2 = Math.floor(Math.random() * (max - min + 1)) + min;
        return part1.toString(36) +'_' + part2.toString(36);
    },
    
    /**
     * Define what data a new inventory item should be instantiated with.  
     * The only default is to set the type to asset; at some point this may be driven by subsection of inventory you are in.
     * @return the default properties for a new inventory item.
     */    
    getNewData: function() {
        return  {
            type: 'Asset'
        };
    }
});