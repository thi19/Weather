/**
 * @description       : 
 * @author            : Thiago Barbosa
 * @group             : 
 * @last modified on  : 11-11-2021
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/

import { LightningElement, track, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import { NavigationMixin } from 'lightning/navigation';
import fetchAllEvents from '@salesforce/apex/FullCalendarService.fetchAllEvents';
import getCreatedEvents from '@salesforce/apex/FullCalendarService.getCreatedEvents';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
/** 
 * FullCalendarJs
 * @description Full Calendar JS - Lightning Web Components
 */
export default class FullCalendarJs extends NavigationMixin( LightningElement ) {

  fullCalendarJsInitialised = false;
  @track allEvents = [];
  @track selectedEvent = undefined;
  createRecord = false;
  strEmail;
  strLocation;
  strDescription;
  @track isLoading = false;

  handleSubmit( event ) {
    console.log( 'onsubmit event recordEditForm' + event.detail.fields );
  }
  handleSuccess( event ) {
    console.log( 'onsuccess event recordEditForm', event.detail.id );
  }

 
  locationChangedHandler( event ) {
    this.strLocation = event.target.value;
  }
  descriptionChangedHandler( event ) {
    this.strDescription = event.target.value;
  }

  /**
   * @description Standard lifecyle method 'renderedCallback'
   *              Ensures that the page loads and renders the 
   *              container before doing anything else
   */
  renderedCallback() {

    // Performs this operation only on first render
    if ( this.fullCalendarJsInitialised ) {
      return;
    }
    this.fullCalendarJsInitialised = true;

    // Executes all loadScript and loadStyle promises
    // and only resolves them once all promises are done
    Promise.all( [
      loadScript( this, FullCalendarJS + '/jquery.min.js' ),
      loadScript( this, FullCalendarJS + '/moment.min.js' ),
      loadScript( this, FullCalendarJS + '/theme.js' ),
      loadScript( this, FullCalendarJS + '/fullcalendar.min.js' ),
      loadStyle( this, FullCalendarJS + '/fullcalendar.min.css' ),
      // loadStyle(this, FullCalendarJS + '/fullcalendar.print.min.css')
    ] )
      .then( () => {
        // Initialise the calendar configuration
        this.getAllEvents();
      } )
      .catch( error => {
        // eslint-disable-next-line no-console
        console.error( {
          message: 'Error occured on FullCalendarJS',
          error
        } );
      } )
  }

  /**
   * @description Initialise the calendar configuration
   *              This is where we configure the available options for the calendar.
   *              This is also where we load the Events data.
   */
  initialiseFullCalendarJs() {
    const ele = this.template.querySelector( 'div.fullcalendarjs' );
    // eslint-disable-next-line no-undef
    $( ele ).fullCalendar( {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay,listWeek'
      },
      themeSystem: 'standard',
      defaultDate: new Date(),
      navLinks: true,
      editable: true,
      eventLimit: true,
      events: this.allEvents,
      dragScroll: true,
      droppable: true,
      weekNumbers: true,
      eventDrop: this.eventDropHandler.bind( this ),
      eventClick: this.eventClickHandler.bind( this ),
      dayClick: this.dayClickHandler.bind( this ),
      eventMouseover: this.eventMouseoverHandler.bind( this )
    } );
  }

  eventMouseoverHandler = ( event, jsEvent, view ) => {

  }
  eventDropHandler = ( event, delta, revertFunc ) => {
    alert( event.title + " was dropped on " + event.start.format() );
    if ( !confirm( "Tem certeza dessa mudança? (Are you sure about this change?) " ) ) {
      revertFunc();
    }
  }

  eventClickHandler = ( event, jsEvent, view ) => {
    this.selectedEvent = event;
  }

  dayClickHandler = ( date, jsEvent, view ) => {
    jsEvent.preventDefault();
    this.createRecord = true;
  }

  createCancel() {
    this.createRecord = false;
  }

  getAllEvents() {
    fetchAllEvents()
      .then( result => {
        this.allEvents = result.map( item => {
          return {
            id: item.Id,
            editable: true,
            title: item.Subject,
            start: item.ActivityDate,
            end: item.EndDateTime,
            description: item.Description,
            allDay: false,
            extendedProps: {
              whoId: item.WhoId,
              whatId: item.WhatId
            },
          };
        } );
        // Initialise the calendar configuration
        this.initialiseFullCalendarJs();
      } )
      .catch( error => {
        window.console.log( ' Error Occured ', error )
      } )
      .finally( () => {
        //this.initialiseFullCalendarJs();
      } )
  }

  closeModal() {
    this.selectedEvent = undefined;
  }

  createdEvent( event ) {

    if ( !this.strLocation || !this.strDescription ) {
      this.showToastMessage( 'Error', 'Please, filled the field', 'Error' );
      return; 
    } 
    this.isLoading = true;   
    getCreatedEvents( { location: this.strLocation, description: this.strDescription } )
      .then( result => { 
        if ( result ) {  
          this.showToastMessage( 'success', 'The event Record was created', 'success' );
          this.isLoading = false; 
          this.createRecord = false; 
          eval( "$A.get('e.force:refreshView').fire();" );  
         
        } 
      } )
      .catch( error => {
        this.error = error;
        this.isLoading = false;  
        this.showToastMessage( 'error', error, 'error' );
      } )
  }


  showToastMessage( title, message, variant ) {
    this.dispatchEvent(
      new ShowToastEvent( {
        title,
        message,
        variant
      } )
    );
  }
}