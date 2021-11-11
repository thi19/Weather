/**
 * @description       : 
 * @author            : Thiago Barbosa 
 * @group             : 
 * @last modified on  : 11-11-2021
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/

public with sharing class FullCalendarService {

    @AuraEnabled
    public static List<Event> fetchAllEvents(){ 
        List<Event> eventList = new List<Event>();
        eventList = [SELECT  Id, Subject, WhatId, WhoId, 
                    Description, EndDate, EndDateTime, OwnerId,
                    ActivityDate, ActivityDateTime FROM Event LIMIT 100];
        return eventList;  
    }

    @AuraEnabled
    public static Event getCreatedEvents(String location, String description){

        try{
        if(String.isNotBlank(location)|| String.isNotBlank(description)){
            return new Event();
        }   
        Event eventRecord = new Event();
        eventRecord.OwnerId = UserInfo.getUserId();
        eventRecord.Description = description;   
        eventRecord.Subject = 'Email'; 
        eventRecord.WhoId = [SELECT Id FROM Contact LIMIT 1].Id;
        eventRecord.WhoId = [SELECT Id FROM Contact LIMIT 1].Id; 
        eventRecord.WhatId = [SELECT Id FROM Account LIMIT 1].Id;
        eventRecord.Location = location;

        if(eventRecord != null){ 
            Database.upsert(eventRecord);
        }  
        return eventRecord; 
    }catch(Exception ex){ 
        throw new AuraHandledException('Event not created and appear the error' + ex.getMessage() + 'In Line' + ex.getStackTraceString());
    }
    }
}