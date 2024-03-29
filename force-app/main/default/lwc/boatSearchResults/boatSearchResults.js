import { LightningElement,api,wire  } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList'
import { refreshApex } from '@salesforce/apex';
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import BoatMC   from '@salesforce/messageChannel/BoatMessageChannel__c';
import TickerSymbol from '@salesforce/schema/Account.TickerSymbol';

// ...
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

const COLUMNS = [
  {label: 'Name' , fieldName:'Name' , type: 'text',editable:"true"},
  {label: 'Length', fieldName: 'Length__c', type: 'number',editable:"true"},
  {label: 'Price', fieldName: 'Price__c', type: 'currency',editable:"true"},
  {label: 'Description', fieldName: 'Description__c', type: 'text',editable:"true"}
]

export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = COLUMNS;
  boatTypeId = '';
  boatTypeName = '';
  boats;
  isLoading = false;
  
  // wired message context
  @wire(MessageContext)
  messageContext;


  @wire(getBoats, { boatTypeId: '$boatTypeId' })
  wiredBoats(result) {
      this.boats = result;
      if (result.error) {
          this.error = result.error;
          this.boats = undefined;
      }
      this.isLoading = false;
      this.notifyLoading(this.isLoading);
  }
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  //@api searchBoats(boatTypeId, boatTypeName) { 
  @api searchBoats(boatTypeId) {   
    this.isLoading = true;
    this.notifyLoading(this.isLoading); 
    this.boatTypeId =   boatTypeId;  
    //this.boatTypeName = boatTypeName;
  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api
  async refresh() {
       this.isLoading = true;
      this.notifyLoading(this.isLoading);      
      await refreshApex(this.boats);
      this.isLoading = false;
      this.notifyLoading(this.isLoading);        
  }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) { 
   
    //alert(event.detail.boatId);    
     this.selectedBoatId = event.detail.boatId;
     this.sendMessageService(this.selectedBoatId);  

     //alert(this.selectedBoatId);
     
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 

  
    
    // explicitly pass boatId to the parameter recordId
    //   const payload = { recordId : this.boatId};
       
     // publish(this.messageContext, BoatMC , payload);
    publish(this.messageContext, BoatMC, { recordId : boatId });
    

  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    this.notifyLoading(true);
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then((res) => {

      this.dispatchEvent(

        new ShowToastEvent({

          title: SUCCESS_TITLE,
          message: MESSAGE_SHIP_IT,
          variant: SUCCESS_VARIANT

        })

      );
      this.draftValues = [];
      return this.refresh();
    })
    .catch(error => {

      this.error = error;
           this.dispatchEvent(
                new ShowToastEvent({
                    title: ERROR_TITLE,
                    message: error.body.message,
                    variant: ERROR_VARIANT
                })
            );
            this.notifyLoading(false);

    })
    .finally(() => {
      this.draftValues = [];
    });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if (isLoading) {
        this.dispatchEvent(new CustomEvent('loading'));
    } else {
        this.dispatchEvent(new CustomEvent('doneloading'));
    }
  }
}
