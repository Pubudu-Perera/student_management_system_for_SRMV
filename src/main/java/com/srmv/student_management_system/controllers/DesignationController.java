package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Designation;
import com.srmv.student_management_system.repositories.DesignationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping(value = "/designation")

public class DesignationController {

    @Autowired
    public DesignationRepository designationDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Designation> designationList(){
        return designationDao.findAll();
    }
}
