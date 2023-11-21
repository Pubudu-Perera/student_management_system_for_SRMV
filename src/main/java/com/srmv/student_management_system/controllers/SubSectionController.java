package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.SubSection;
import com.srmv.student_management_system.repositories.SubSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/sub_section")
public class SubSectionController {

    @Autowired
    public SubSectionRepository subSectionDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<SubSection> getSubSections(){
        return subSectionDao.findAll();
    }
}
