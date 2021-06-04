// imports
import { LightningElement, api,wire} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

// import getSimilarBoats
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';
import BOAT_OBJECT from '@salesforce/schema/Boat__c';
export default class SimilarBoats extends NavigationMixin(LightningElement) {
    // Private
    currentBoat;
    relatedBoats;
    boatId;
    error;
    
    // public
    @api 
    get recordId() {
        // returns the boatId
        return this.boatId;
      }
      set recordId(value) {
          //sets boatId attribute
            this.setAttribute('boatId', value);       
          //sets boatId assignment
            this.boatId = value;

      }
    
    // public
    @api similarBy;
    
    // Wire custom Apex call, using the import named getSimilarBoats
    // Populates the relatedBoats list
    
    @wire(getSimilarBoats, {boatId : '$boatId', similarBy : '$similarBy'})
    similarBoats({ error, data }) { 

        if(data)
        {
            this.relatedBoats=data;
            this.error=undefined;
        }
        else if(error)
        {
            this.relatedBoats=undefined;
            this.error=error;
        }

    }
    get getTitle() {
      return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
      return !(this.relatedBoats && this.relatedBoats.length > 0);
    }
    
    // Navigate to record page
    openBoatDetailPage(event) { 
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.boatId,
                objectApiName: BOAT_OBJECT,
                actionName: 'view'
            },
        });
    }
  }
  