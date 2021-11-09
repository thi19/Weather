/**
 * @description       : 
 * @author            : Thiago Barbosa 
 * @group             : 
 * @last modified on  : 11-09-2021
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
}
