package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Medium;
import com.srmv.student_management_system.repositories.MediumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/medium")
public class MediumController {

    @Autowired
    public MediumRepository mediumDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Medium> getMediums(){
        return mediumDao.findAll();
    }
}
