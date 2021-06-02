import { LightningElement } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

 // imports
 export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
    
    // Handles loading event
    handleLoading(event) { 

     // this.isLoading = true;

      //  this.template.querySelector('c-boat-search-results').searchBoats('', 'All Types');
    }
    
    // Handles done loading event
    handleDoneLoading(event) { 

     // this.isLoading = false;
    }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) {     
        
        
        //alert(event.detail.boatTypeId);
        //alert(event.detail.boatTypeName);
       
       // this.template.querySelector('c-boat-search-results').searchBoats(event.detail.boatTypeId, event.detail.boatTypeName);
        this.template.querySelector('c-boat-search-results').searchBoats(event.detail.boatTypeId);
    }
    
    createNewBoat(event) { 

      this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: 'Boat__c',
            actionName: 'new'
        }
    });

    }
  }
  