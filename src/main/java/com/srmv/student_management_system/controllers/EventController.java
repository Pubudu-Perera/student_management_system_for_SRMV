package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Event;
import com.srmv.student_management_system.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/event")
public class EventController {

    @Autowired
    EventRepository eventDao;

    @GetMapping(value = "/list")
    public List<Event> eventList(){
        return eventDao.findAll();
    }

//    Getting the
    @GetMapping(value = "/examEventByAcaYear/{aca_id}")
    public List<Event> getEventsByAcaYearList(@PathVariable Integer aca_id){
        return eventDao.getEventListByAcaYear(aca_id);
    }
}
