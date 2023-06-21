import search from '@salesforce/apex/customLookupController.search';
import { api, LightningElement, track, wire } from 'lwc';
    
    
    export default class UserSelectComponent extends LightningElement 
    {
        @track preventClosingOfSerachPanel; 
        @track objName = 'Profile';
        @track showrelatedrecords = false;
        @api objIndex;  
        @api objType;
        @api objCol;
        @api selectedCol;
        @api selectedObjType;  
        @api iconName = 'standard:user';
        @api searchPlaceholder='Search';
    
        @track selectedName;
        @track selectId;
        @track records;
        @track isValueSelected;
        @track blurTimeout;
        @track recName = false;
        @track recCaseNumber = false;
        @track recInvoiceNumber = false;
        @track searchTerm;
    
        @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        @track inputClass = '';
    
      
        @wire(search, {searchTerm : '$searchTerm', myObject : '$objName'})
        wiredRecords({ error, data }) {
            if (data) {           
                this.error = undefined;
                // let records = JSON.parse(JSON.stringify(data));
                // for(let i=0; i < records.length; i++)
                // {
                //     console.log('rec'+JSON.stringify(records[i]));
                //     this.records[i].Id = records[i].ProfileId;
                //     this.records[i].Name = records[i].Profile.Name;
                // }
          this.records = data;
                    this.showrelatedrecords = true;
            } else if (error) {
                this.error = error;
                this.records = undefined;
            }
              
        }
    
        onBlur() {
            this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
        }

        handleBlur() {
            console.log('b');
            this.records = [];
         //   this.msgBoolean=false;
          //  this.preventClosingOfSerachPanel = false;
        }
    
        //handle the click inside the search panel to prevent it getting closed
        handleDivClick() {
            console.log('div');
           // this.msgBoolean=false;
          //  this.preventClosingOfSerachPanel = true;
        }

        handleSelect(event) {
            this.isValueSelected = true;

            let selectedId = event.currentTarget.dataset.id;
            this.selectId = selectedId;   
          //  console.log(' this.selectId'+ this.selectId);

    
            let selectedName = event.currentTarget.dataset.name;
            this.selectedName = selectedName;
           // console.log(' this.selectedName'+ this.selectedName);
           
            const valueSelectedEvent = new CustomEvent('lookupselected', {detail: {selectedId : selectedId, selectedName : selectedName}});
            this.dispatchEvent(valueSelectedEvent);

           
            if(this.blurTimeout) {
            clearTimeout(this.blurTimeout);
            }
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        }
    
        handleRemoveSelectedOption() 
        {
            this.searchTerm = '';
            this.records = [];
            this.isValueSelected = false;
    
           const valueSelectedEvent = new CustomEvent('lookupunselected', { detail: {SelectedValue: this.isValueSelected} });
           this.dispatchEvent(valueSelectedEvent); 
    
        }
    
        onChange(event) {
            this.searchTerm = event.target.value;
            //console.log('this.searchTerm'+this.searchTerm);
        }
    
    }