package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Section;
import com.srmv.student_management_system.repositories.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/section")
public class SectionController {

    @Autowired
    public SectionRepository sectionDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Section> getSections(){
        return sectionDao.findAll();
    }
}
