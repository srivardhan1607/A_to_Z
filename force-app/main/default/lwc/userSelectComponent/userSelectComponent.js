import { LightningElement, api , track } from 'lwc';
import fetchRecords from '@salesforce/apex/ReusableLookupController.fetchRecords';
/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 500;

export default class UserSelectComponent extends LightningElement {
    @api helpText = "";
    @api label = "";
    @api required;
    @api selectedIconName = "";
    recordsList = [];
    selectedRecordName;
    @api searchByOtherField = false;
    @api objectApiName = "";
    @api fieldApiName = "";
    @api otherFieldApiName = "";
    @api searchString = "";
    @api selectedRecordId = "";
    @api parentRecordId;
    @api parentFieldApiName;
    @track msg='';
    @track msgBoolean=false;
    preventClosingOfSerachPanel = false;

    get methodInput() {
        return {
            objectApiName: this.objectApiName,
            fieldApiName: this.fieldApiName,
            otherFieldApiName: this.otherFieldApiName,
            searchString: this.searchString,
            selectedRecordId: this.selectedRecordId,
            parentRecordId: this.parentRecordId,
            parentFieldApiName: this.parentFieldApiName,
            searchByOtherField:this.searchByOtherField
        };
    }

    get showRecentRecords() {
        if (!this.recordsList) {
            return false;
        }
        return this.recordsList.length > 0;
    }

    //getting the default selected record
    connectedCallback() {
        if (this.selectedRecordId) {
            this.fetchSobjectRecords(true);
           
        }
    }

    //call the apex method
    fetchSobjectRecords(loadEvent) {
        fetchRecords({
            inputWrapper: this.methodInput
        }).then(result => {
            if (loadEvent && result) {
                this.selectedRecordName = result[0].mainField;
            } else if (result) {
                this.recordsList = JSON.parse(JSON.stringify(result));
            } else {
                this.recordsList = [];
            }
            if(this.recordsList.length < 1){
                this.msgBoolean=true;
                this.msg='No Records Found for \''+this.searchString+'\'';
               
            }
            if(this.selectedRecordId){
                this.msgBoolean=false;
            }
        }).catch(error => {
            console.log(error);
        })
    }

    get isValueSelected() {
        return this.selectedRecordId;
    }

    //handler for calling apex when user change the value in lookup
    handleChange(event) {
        this.searchString = event.target.value;
        this.fetchSobjectRecords(false);
    }

    //handler for clicking outside the selection panel
    handleBlur() {
        this.recordsList = [];
        this.msgBoolean=false;
        this.preventClosingOfSerachPanel = false;
    }

    //handle the click inside the search panel to prevent it getting closed
    handleDivClick() {
        this.msgBoolean=false;
        this.preventClosingOfSerachPanel = true;
    }

    //handler for deselection of the selected item
    handleCommit() {
        this.selectedRecordId = "";
        this.selectedRecordName = "";
    }

    //handler for selection of records from lookup result list
    handleSelect(event) {
        let selectedRecord = {
            mainField: event.currentTarget.dataset.mainfield,
            subField: event.currentTarget.dataset.subfield,
            id: event.currentTarget.dataset.id
        };
        this.selectedRecordId = selectedRecord.id;
        this.selectedRecordName = selectedRecord.mainField;
        this.recordsList = [];
        // Creates the event
        const selectedEvent = new CustomEvent('valueselected', {
            detail: selectedRecord
        });
        //dispatching the custom event
        this.dispatchEvent(selectedEvent);
    }
    
    //to close the search panel when clicked outside of search input
    handleInputBlur(event) {
        this.msgBoolean=false;
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            if (!this.preventClosingOfSerachPanel) {
                this.recordsList = [];
            }
            this.preventClosingOfSerachPanel = false;
        }, DELAY);
    }

}