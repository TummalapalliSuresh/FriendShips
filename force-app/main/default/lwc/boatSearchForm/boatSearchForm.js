import { LightningElement,wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes'

// imports
// import getBoatTypes from the BoatDataService => getBoatTypes method';
export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';
    selectedBoatTypeName = '';
    
    // Private
    error = undefined;
    searchOptions;
   
    // Wire a custom Apex method
      @wire(getBoatTypes)
      boatTypes({ error, data }) {          
      if (data) {       
        this.searchOptions = data.map(type => {
          // TODO: complete the logic
          return {
            label: type.Name, value : type.Id
        }
        });
        this.searchOptions.unshift({ label: 'All Types', value: '' });
      } else if (error) {       
        this.searchOptions = undefined;
        this.error = error;
      }
    }
    
    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {

        this.selectedBoatTypeId= event.detail.value;
        this.selectedBoatTypeName=event.target.options.find(opt => opt.value === event.detail.value).label;
       
      // Create the const searchEvent
      // searchEvent must be the new custom event search
      
      //const searchEvent=new CustomEvent('search', {detail : { boatTypeId: this.selectedBoatTypeId, boatTypeName: this.selectedBoatTypeName} })
      const searchEvent=new CustomEvent('search', {detail : { boatTypeId: this.selectedBoatTypeId} })
      this.dispatchEvent(searchEvent);
    }
  }
  