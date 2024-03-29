import { LightningElement,api,wire  } from 'lwc';
import { getRecord,getFieldValue   } from 'lightning/uiRecordApi';


// import BOATMC from the message channel
import { APPLICATION_SCOPE, subscribe, MessageContext } from 'lightning/messageService';
import BoatMC   from '@salesforce/messageChannel/BoatMessageChannel__c';

// Declare the const LONGITUDE_FIELD for the boat's Longitude__s
const LONGITUDE_FIELD = 'Boat__c.Geolocation__Longitude__s';
// Declare the const LATITUDE_FIELD for the boat's Latitude
const LATITUDE_FIELD ='Boat__c.Geolocation__Latitude__s'; 
// Declare the const BOAT_FIELDS as a list of [LONGITUDE_FIELD, LATITUDE_FIELD];
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD] ;
export default class BoatMap extends LightningElement {
  // private
  subscription = null;
  @api boatId;

  // Getter and Setter to allow for logic to run on recordId change
  // this getter must be public
  @api get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute('boatId', value);
    this.boatId = value;
  }

  error = undefined;
  @api mapMarkers = [];

  // Initialize messageContext for Message Service
  @wire(MessageContext)
  messageContext;


  // Getting record's location to construct map markers using recordId
  // Wire the getRecord method using ('$boatId')
  @wire (getRecord,{ recordId : '$boatId' , fields:BOAT_FIELDS})
  wiredRecord({ error, data }) {
    
    // Error handling
    if (data) {
      
      this.error = undefined;
      const longitude = data.fields.Geolocation__Longitude__s.value;
      const latitude = data.fields.Geolocation__Latitude__s.value;
      this.updateMap(longitude, latitude);

    } else if (error) {

      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }

    // By using the MessageContext @wire adapter, unsubscribe will be called
    // implicitly during the component descruction lifecycle.
    @wire(MessageContext)
    messageContext;


    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeMC() 
    {

      //let subscription = subscribe(
      //  this.messageContext, BoatMC, 
      //  (message) => this.handleMessage(message), 
      //  { scope: APPLICATION_SCOPE });

      //APPLICATION_SCOPE is optional here
      this.subscription = subscribe(
              this.messageContext, 
              BoatMC, (message) => { this.boatId = message.recordId }, 
              { scope: APPLICATION_SCOPE });
          
    }

   // Handler for message received by component
   //Not used here, DirectlyHandled in SubscribeMessageChannel Method
   handleMessage(message) {   
    this.boatId = message.recordId;
    }

    // Calls subscribeToMessageChannel()
    connectedCallback() 
    {
    // recordId is populated on Record Pages, and this component
    // should not update when this component is on a record page.
    if (this.subscription || this.recordId) {
      return;
    }

    this.subscribeMC();
    
  }

  // Creates the map markers array with the current boat's location for the map.
   updateMap(Longitude, Latitude) {
     
       this.mapMarkers = [{
        location: {
            Latitude: Latitude,
            Longitude: Longitude
        },
        title: '',
        description: '',
        icon: 'utility:salesforce1'
    }];
   
  }

  // Getter method for displaying the map component, or a helper method.
  get showMap() {   
    return this.mapMarkers.length > 0;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  unsubscribeToMessageChannel() {
   
    this.subscription = null;
}
}