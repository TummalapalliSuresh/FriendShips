import { LightningElement } from 'lwc';

import RetreiveNews from '@salesforce/apex/newsController.RetreiveNews';


export default class NewsComponent extends LightningElement {

result =[];
selectedNews={};
isModalOpen = false;
connectedCallback(){

    this.fetchNews();
}

get modalBackdropClass()
{
    return this.isModalOpen ? "slds-backdrop slds-backdrop_open" : "slds-backdrop";
    
}

get modalClass(){

    return `slds-modal ${this.isModalOpen ? "slds-fade-in-open" : ""}`;
   // return this.isModalOpen ? "slds-modal slds-fade-in-open" : "slds-modal";
}
fetchNews(){

    RetreiveNews().then(response=>{
        console.log(response);
        this.formatNewsData(response.articles);
    }).catch(error=> {
        console.error(error);
    }        
    );

}

formatNewsData(res){
    console.log(res);
    this.result = res.map((item, index) => {
        let id = `new_${index+1}`;
        let date = new Date(item.publishedAt).toDateString();
        let name = item.source.name;
        return {...item, id:id, name:name, date:date };
    })

}

ShowModal(event)
{

    let id = event.target.dataset.item;

    this.result.forEach(item=> {

        if(item.id == id){

            this.selectedNews = {...item};
        }
    })
    
    this.isModalOpen = true;

}



CloseModal(event)
{
this.isModalOpen = false;

}


}

