import { LightningElement,track } from 'lwc';

export default class UserSetupPage extends LightningElement {
    @track startHours = {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
    };

    @track endHours = {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
    };

    daysOfWeek = [
        { label: 'Monday', value: 'monday' },
        { label: 'Tuesday', value: 'tuesday' },
        { label: 'Wednesday', value: 'wednesday' },
        { label: 'Thursday', value: 'thursday' },
        { label: 'Friday', value: 'friday' },
        { label: 'Saturday', value: 'saturday' },
        { label: 'Sunday', value: 'sunday' }
    ];

    handleStartChange(event) {
        const day = event.target.dataset.day;
        this.startHours[day] = event.target.value;
    }

    handleEndChange(event) {
        const day = event.target.dataset.day;
        this.endHours[day] = event.target.value;
    }

    handleSave() {
        // Perform save logic here
        console.log('Start Hours:', this.startHours);
        console.log('End Hours:', this.endHours);
    }
}