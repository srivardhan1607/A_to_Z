import { LightningElement,track } from 'lwc';
import getProfileData from '@salesforce/apex/ProfileMetaDataController.getProfileData';
import updateProfileData from '@salesforce/apex/ProfileMetaDataController.updateProfileData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const actions = [
  { label: 'Delete', name: 'delete' }
];

const columns = [
  { label: 'start Address', fieldName: 'startAddress', type: 'text' },
  { label: 'end Address', fieldName: 'endAddress', type: 'text' },
  { label: 'description', fieldName: 'description', type: 'text' },
  { type: 'action', typeAttributes: { rowActions: actions } }
];

export default class UserSetupPage extends LightningElement {
  columns = columns;
  @track selectedProfile = '';
  @track showModal = false;
  @track selectedNavItem = 'loginHours';
  @track noLoginIPRanges = false;
  @track selectedIndex;
  @track showEditModal = false;
  @track showLoginHours = false;
  @track showLoginIPRanges = false;
  @track newloginIpRange = {"description":"","endAddress":"","startAddress":""};
  @track editLoginIpRange = {"description":"","endAddress":"","startAddress":""};
  @track editLoginIpRanges = true;
  @track toBeDeletedloginIpRanges = [];
  @track loginHours = {fridayEnd:null, fridayStart:null, mondayEnd:null, mondayStart:null, saturdayEnd:null, saturdayStart:null, sundayEnd:null, sundayStart:null, thursdayEnd:null, thursdayStart:null, tuesdayEnd:null, tuesdayStart:null, wednesdayEnd:null, wednesdayStart:null}
  //@track loginIpRanges={description:'', endAddress:'', startAddress:''}
  @track loginIpRanges = [];
  activeSections = ['A', 'B'];
  @track showProfileMetadata = false;
  @track ProfileMetadata = {};
  selectedStartHour = '12:00 AM';
    @track startHours = [
      { label: '12:00 AM', value: 0 },
      { label: '1:00 AM', value: 1 },
      { label: '2:00 AM', value: 2 },
      { label: '3:00 AM', value: 3 },
      { label: '4:00 AM', value: 4 },
      { label: '5:00 AM', value: 5 },
      { label: '6:00 AM', value: 6},
      { label: '7:00 AM', value: 7},
      { label: '8:00 AM', value: 8},
      { label: '9:00 AM', value: 9},
      { label: '10:00 AM', value: 10},
      { label: '11:00 AM', value: 11},
      { label: '12:00 PM', value: 12},
      { label: '1:00 PM', value: 13},
      { label: '2:00 PM', value: 14},
      { label: '3:00 PM', value: 15},
      { label: '4:00 PM', value: 16},
      { label: '5:00 PM', value: 17},
      { label: '6:00 PM', value: 18},
      { label: '7:00 PM', value: 19},
      { label: '8:00 PM', value: 20},
      { label: '9:00 PM', value: 21},
      { label: '10:00 PM', value: 22},
      { label: '11:00 PM', value: 23},
      { label: 'End of Day', value: 24}
      ];

      @track endHours = [
        { label: '12:00 AM', value: 0 },
        { label: '1:00 AM', value: 1 },
        { label: '2:00 AM', value: 2 },
        { label: '3:00 AM', value: 3 },
        { label: '4:00 AM', value: 4 },
        { label: '5:00 AM', value: 5 },
        { label: '6:00 AM', value: 6},
        { label: '7:00 AM', value: 7},
        { label: '8:00 AM', value: 8},
        { label: '9:00 AM', value: 9},
        { label: '10:00 AM', value: 10},
        { label: '11:00 AM', value: 11},
        { label: '12:00 PM', value: 12},
        { label: '1:00 PM', value: 13},
        { label: '2:00 PM', value: 14},
        { label: '3:00 PM', value: 15},
        { label: '4:00 PM', value: 16},
        { label: '5:00 PM', value: 17},
        { label: '6:00 PM', value: 18},
        { label: '7:00 PM', value: 19},
        { label: '8:00 PM', value: 20},
        { label: '9:00 PM', value: 21},
        { label: '10:00 PM', value: 22},
        { label: '11:00 PM', value: 23},
        { label: 'End of Day', value: 24}
      ];

    @track daysOfWeek = [
        { label: 'Sunday'},
        { label: 'Monday'},
        { label: 'Tuesday'},
        { label: 'Wednesday'},
        { label: 'Thursday'},
        { label: 'Friday'},
        { label: 'Saturday'}
    ];

    handledisableData()
    {
      this.daysOfWeek = [
        { label: 'Sunday'},
        { label: 'Monday'},
        { label: 'Tuesday'},
        { label: 'Wednesday'},
        { label: 'Thursday'},
        { label: 'Friday'},
        { label: 'Saturday'}
    ];
    this.loginHours = {fridayEnd:null, fridayStart:null, mondayEnd:null, mondayStart:null, saturdayEnd:null, saturdayStart:null, sundayEnd:null, sundayStart:null, thursdayEnd:null, thursdayStart:null, tuesdayEnd:null, tuesdayStart:null, wednesdayEnd:null, wednesdayStart:null}
    this.loginIpRanges = [];
    this.showProfileMetadata = false;
    }
    handleItems(event)
    {
       let name = event.target.name;
       if(name == 'loginHours')
       {
        this.selectedNavItem = 'loginHours';
        this.showLoginHours = true;
        this.showLoginIPRanges = false;
        this.noLoginIPRanges = false;
       }
       if(name == 'loginIpRanges')
       {
        this.selectedNavItem = 'loginIpRanges';
        this.showLoginHours = false;
        if(this.profileMetaData.loginIpRanges.length>0)
        {
          this.showLoginIPRanges = true;
          this.noLoginIPRanges = false;
        }else{
          this.noLoginIPRanges = true;
          this.showLoginIPRanges = false;
        }
       }
    }
    handlelookupunselected()
    {
        this.selectedNavItem = 'loginHours';
        this.showLoginHours = true;
        this.showLoginIPRanges = false;
        this.showProfileMetadata = false;
      //  location.reload();
    }
    handlelookupselected(event)
    {
      this.selectedNavItem = 'loginHours';
      this.showLoginHours = true;
      this.showLoginIPRanges = false;
      this.selectedProfile =  event.detail.selectedId;
      getProfileData({ selectedProfileId: this.selectedProfile })
            .then((result) => {             
              this.profileMetaData = JSON.parse(JSON.stringify(result)); 
              this.showProfileMetadata = true;           
              console.log('profileMetaData'+JSON.stringify(this.profileMetaData)); 
          
           
            this.daysOfWeek[0].startHour = parseInt(this.profileMetaData.loginHours.sundayStart) / 60;
            this.daysOfWeek[0].endHour = parseInt(this.profileMetaData.loginHours.sundayEnd) / 60;

            this.daysOfWeek[1].startHour = parseInt(this.profileMetaData.loginHours.mondayStart) / 60;
            this.daysOfWeek[1].endHour = parseInt(this.profileMetaData.loginHours.mondayEnd) / 60;

            this.daysOfWeek[2].startHour = parseInt(this.profileMetaData.loginHours.tuesdayStart) / 60;
            this.daysOfWeek[2].endHour = parseInt(this.profileMetaData.loginHours.tuesdayEnd) / 60;

            this.daysOfWeek[3].startHour = parseInt(this.profileMetaData.loginHours.wednesdayStart) / 60;
            this.daysOfWeek[3].endHour = parseInt(this.profileMetaData.loginHours.wednesdayEnd) / 60;

            this.daysOfWeek[4].startHour = parseInt(this.profileMetaData.loginHours.thursdayStart) / 60;
            this.daysOfWeek[4].endHour = parseInt(this.profileMetaData.loginHours.thursdayEnd) / 60;

            this.daysOfWeek[5].startHour = parseInt(this.profileMetaData.loginHours.fridayStart) / 60;
            this.daysOfWeek[5].endHour = parseInt(this.profileMetaData.loginHours.fridayEnd) / 60;

            this.daysOfWeek[6].startHour = parseInt(this.profileMetaData.loginHours.saturdayStart) / 60;
            this.daysOfWeek[6].endHour = parseInt(this.profileMetaData.loginHours.saturdayEnd) / 60;
             
            for(let i=0;i<this.profileMetaData.loginIpRanges.length;i++)
              {
                let temprec = Object.assign({}, this.profileMetaData.loginIpRanges[i]); 
                this.loginIpRanges.push(temprec);
              }
            })
            .catch((error) => {
              const event = new ShowToastEvent({
                title: 'Toast message',
                message: error,
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
            });

          //   let temploginHours =  this.profileMetaData.loginHours;
          //   this.loginHours = temploginHours;
          //   console.log('this.loginHours 148'+JSON.stringify(temploginHours)); 
    }
    handleStartHourChange(event) {
        const selectedStartHour = event.target.value;
        const day = event.target.dataset.id;
        this.daysOfWeek[day].startHour = parseInt(selectedStartHour);
      if(day == 0)
      {
        let sundayStart = selectedStartHour * 60;
        this.profileMetaData.loginHours.sundayStart = sundayStart.toString();
      }
      if(day == 1)
      {
        let mondayStart = selectedStartHour * 60;
        this.profileMetaData.loginHours.mondayStart = mondayStart.toString();
      }
      if(day == 2)
      {
        let tuesdayStart = selectedStartHour * 60;
        this.profileMetaData.loginHours.tuesdayStart = tuesdayStart.toString();
      }
      if(day == 3)
      {
        let wednesdayStart = selectedStartHour * 60;
        this.profileMetaData.loginHours.wednesdayStart = wednesdayStart.toString();
      }
      if(day == 4)
      {
        let thursdayStart = selectedStartHour * 60;
        this.profileMetaData.loginHours.thursdayStart = thursdayStart.toString();
      }
      if(day == 5)
      {
        let fridayStart = selectedStartHour * 60;
        this.profileMetaData.loginHours.fridayStart = fridayStart.toString();
      }
      if(day == 6)
      {
        let saturdayStart = selectedStartHour * 60;
        this.profileMetaData.loginHours.saturdayStart = saturdayStart.toString();
      }
  }
    
      handleEndHourChange(event) {
        const selectedEndHour = event.target.value;
        const day = event.target.dataset.id;
        this.daysOfWeek[day].endHour = parseInt(selectedEndHour);

        if(day == 0)
        {
          let sundayEnd = selectedEndHour * 60;
          this.profileMetaData.loginHours.sundayEnd = sundayEnd.toString();
        }
        if(day == 1)
        {
          let mondayEnd = selectedEndHour * 60;
          this.profileMetaData.loginHours.mondayEnd = mondayEnd.toString();
        }
        if(day == 2)
        {
          let tuesdayEnd = selectedEndHour * 60;
          this.profileMetaData.loginHours.tuesdayEnd = tuesdayEnd.toString();
        }
        if(day == 3)
        {
          let wednesdayEnd = selectedEndHour * 60;
          this.profileMetaData.loginHours.wednesdayEnd = wednesdayEnd.toString();
        }
        if(day == 4)
        {
          let thursdayEnd = selectedEndHour * 60;
          this.profileMetaData.loginHours.thursdayEnd = thursdayEnd.toString();
        }
        if(day == 5)
        {
          let fridayEnd = selectedEndHour * 60;
          this.profileMetaData.loginHours.fridayEnd = fridayEnd.toString();
        }
        if(day == 6)
        {
          let saturdayEnd = selectedEndHour * 60;
          this.profileMetaData.loginHours.saturdayEnd = saturdayEnd.toString();
        }
      }
      handleIpRanges(event)
      {
         let name = event.target.name;
         let index = event.target.dataset.id;
         this.profileMetaData.loginIpRanges[index][name] = event.target.value;
         console.log('this.loginIpRanges', name);
         console.log('this.profileMetaData.loginIpRanges', JSON.stringify(this.profileMetaData.loginIpRanges));
      }
      handleCreateNewIpRange()
      {
         this.showModal = true;
      }

      handleDeleteIpRanges(event)
      { 
          let index = event.target.dataset.id;
          console.log('index'+ index);
        //  this.profileMetaData.loginHours = [];
          
          let tempdata = { ...this.profileMetaData };
          tempdata.loginIpRanges.splice(index, 1);
          console.log('tempdata.loginIpRanges', JSON.stringify(tempdata.loginIpRanges));
         // this.profileMetaData.loginIpRanges = [...tempdata.loginIpRanges];
          this.profileMetaData = { ...tempdata };
         // this.profileMetaData.loginIpRanges.push({"description":"","endAddress":"","startAddress":""});
          // for(let i = 0; i < tempdata.loginIpRanges.length; i++) 
          // {
          //     let tempRecord = Object.assign({}, tempdata.loginIpRanges[i]); 
          //     this.profileMetaData.loginHours.push(tempRecord); 
          // }
          // let loginIpRanges = [];
          // for(let i=0;i<this.profileMetaData.loginIpRanges.length;i++)
          // {
          //     console.log('264');
          //     let tempRecord = Object.assign({}, this.profileMetaData.loginIpRanges[i]); 
          //     console.log('266');
          //     if(i != index) 
          //     {
          //       console.log('loginIpRanges'+JSON.stringify(loginIpRanges));
          //       loginIpRanges.push(tempRecord);
          //       console.log('loginIpRanges'+JSON.stringify(loginIpRanges));
          //     }
          // }
          // this.profileMetaData.loginIpRanges = loginIpRanges;  
         // this.profileMetaData = Object.assign({}, tempdata);
          console.log('this.profileMetaData.loginIpRanges', JSON.stringify(this.profileMetaData.loginIpRanges));
 
      }
      handleModal()
      {
        this.showModal = false;
      }
      handleEditIpRanges(event)
      {
        let index = event.target.dataset.id;
        this.selectedIndex = index;
        this.showEditModal = true;
        console.log('index'+JSON.stringify(index));
        this.editLoginIpRange = this.ProfileMetadata.loginIpRanges[index];
        console.log('loginIpRanges322'+JSON.stringify(this.editLoginIpRange));
      }
      handleEditIPRange(event)
      {
          let name = event.target.name;
          this.editLoginIpRange[name] = event.target.value;
          console.log('loginIpRanges322'+JSON.stringify(this.editLoginIpRange));
       
      }
      handleCloseModal()
      {
        this.showEditModal = false;
      }
      handleNewIPRange(event)
      {
          let name = event.target.name;
          this.newloginIpRange[name] = event.target.value;
      }
      handleSaveIPRange()
      {
        this.showLoginIPRanges = true;
        this.noLoginIPRanges = false;
       // this.newloginIpRange = {"description":"","endAddress":"","startAddress":""};
        this.profileMetaData.loginIpRanges.push(this.newloginIpRange);
        this.showModal = false;
        this.newloginIpRange ={"description":"","endAddress":"","startAddress":""};
        console.log('this.profileMetaData.loginIpRanges', JSON.stringify(this.profileMetaData.loginIpRanges));
      }
    handleSave() 
    {
      if(this.profileMetaData.loginHours.sundayStart == undefined)
      {
        this.profileMetaData.loginHours.sundayStart = null;
      }
      if(this.profileMetaData.loginHours.sundayEnd == undefined)
      {
        this.profileMetaData.loginHours.sundayEnd = null;
      }
   
      if(this.profileMetaData.loginHours.mondayStart == undefined)
      {
        this.profileMetaData.loginHours.mondayStart = null;
      }
      if(this.profileMetaData.loginHours.mondayEnd == undefined)
      {
        this.profileMetaData.loginHours.mondayEnd = null;
      }

      if(this.profileMetaData.loginHours.tuesdayStart == undefined)
      {
        this.profileMetaData.loginHours.tuesdayStart = null;
      }
      if(this.profileMetaData.loginHours.tuesdayEnd == undefined)
      {
        this.profileMetaData.loginHours.tuesdayEnd = null;
      }

      if(this.profileMetaData.loginHours.wednesdayStart == undefined)
      {
        this.profileMetaData.loginHours.wednesdayStart = null;
      }
      if(this.profileMetaData.loginHours.wednesdayEnd == undefined)
      {
        this.profileMetaData.loginHours.wednesdayEnd = null;
      }

      if(this.profileMetaData.loginHours.thursdayStart == undefined)
      {
        this.profileMetaData.loginHours.thursdayStart = null;
      }
      if(this.profileMetaData.loginHours.thursdayEnd == undefined)
      {
        this.profileMetaData.loginHours.thursdayEnd = null;
      }

      if(this.profileMetaData.loginHours.fridayStart == undefined)
      {
        this.profileMetaData.loginHours.fridayStart = null;
      }
      if(this.profileMetaData.loginHours.fridayEnd == undefined)
      {
        this.profileMetaData.loginHours.fridayEnd = null;
      }

      if(this.profileMetaData.loginHours.saturdayStart == undefined)
      {
        this.profileMetaData.loginHours.saturdayStart = null;
      }
      if(this.profileMetaData.loginHours.saturdayEnd == undefined)
      {
        this.profileMetaData.loginHours.saturdayEnd = null;
      }

      for(let i=0;i<this.profileMetaData.loginIpRanges.length;i++)
      {
          if(this.profileMetaData.loginIpRanges[i].description == "" || this.profileMetaData.loginIpRanges[i].description == undefined)
          {
            this.profileMetaData.loginIpRanges[i].description = null;
          }
          if(this.profileMetaData.loginIpRanges[i].startAddress == "" || this.profileMetaData.loginIpRanges[i].startAddress == undefined)
          {
            this.profileMetaData.loginIpRanges[i].startAddress = null;
          }
          if(this.profileMetaData.loginIpRanges[i].endAddress == "" || this.profileMetaData.loginIpRanges[i].endAddress == undefined)
          {
            this.profileMetaData.loginIpRanges[i].endAddress = null;
          }
      }
      console.log('this.profileMetaData', JSON.stringify(this.profileMetaData));
      updateProfileData({ profileMetaDatastr : JSON.stringify(this.profileMetaData), ProfileID: this.selectedProfile })
      .then((result) => {   
        const event = new ShowToastEvent({
          title: 'Toast message',
          message: result,
          variant: 'success',
          mode: 'dismissable'
      });
      this.dispatchEvent(event);
      })
      .catch((error) => {
        const event = new ShowToastEvent({
          title: 'Toast message',
          message: error,
          variant: 'error',
          mode: 'dismissable'
      });
      this.dispatchEvent(event);
      });
    }
}