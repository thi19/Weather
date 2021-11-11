import { LightningElement, track, wire } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import performCallout from '@salesforce/apex/WebServiceLWC.performCallout';
import weather from '@salesforce/resourceUrl/weather';
 
export default class WeatherDataLWC extends LightningElement {
 
    @track lat;
    @track long;
 
    @track mapMarkers = [];     
    zoomLevel = 10;
    @track result;
    @track value;
 
    connectedCallback() {
        this.isLoading = true;
        performCallout({location: 'SaoPaulo'}).then(data => {
            this.mapMarkers = [{
                location: { 
                    Latitude: data['cityLat'],
                    Longitude: data['cityLong']
                },
                title: data['cityName'] + ', ' + data['state'],
            }];
            this.result = data;
            this.isLoading = false; 
        }).catch(err => console.log(err));
        loadStyle(this, weather).then(result => {
            console.log('what is the result?' , result);
        });
    }
 
    get getCityName() {
        if (this.result) { 
            return 'Cidade Informada/ Information of the City / : ' + this.result.cityName;
        } else {    
            return '---'
        }
    }
 
    get getConvertedTemp() {
        if (this.result) {
            return Math.round((this.result.cityTemp)) + ' °C';
        } else { 
            return '--'
        }
    }
 
    get getCurrentWindSpeed() {
        if (this.result) {
            return this.result.cityWindSpeed + ' mph';
        } else {
            return '--'
        }
    }
 
    get getCurrentPrecip() {
        if (this.result) {
            return this.result.cityPrecip + " inches"
        } else {
            return '--'
        } 
    }
 
    get options() {
        return [ 
            { label: 'Campinas, SP', value: 'Campinas' },     
            { label: 'Madrid, Spain', value: 'Madri' },   
            { label: 'New York, NY', value: 'NewYork' },
            { label: 'São Paulo, SP', value: 'SaoPaulo' }, 
            { label: 'Lisboa, Portugal', value: 'Lisboa' }, 
            { label: 'Alicante, Spain', value: 'Alicante' },   
            { label: 'Danbury, Connecticut', value: 'Danbury' },   
            { label: 'Chicago, Illinois', value: 'Chicago' },
            { label: 'Paris, France', value: 'Paris' }             
        ];       
    }   
 
    handleChange(event) { 
        this.value = event.detail.value;
        this.isLoading = true;
        performCallout({location: this.value}).then(data => {
            this.mapMarkers = [{
                location: {
                    Latitude: data['cityLat'],
                    Longitude: data['cityLong']
                },
                title: data['cityName'] + ', ' + data['state'],
            }]; 
            this.result = data; 
            this.isLoading = false; 
        }).catch(err => console.log(err));
    }
} 