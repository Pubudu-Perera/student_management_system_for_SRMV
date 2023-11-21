package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Civil_status;
import com.srmv.student_management_system.repositories.CivilStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/civil_status")
public class CivilStatusController {

    @Autowired
    public CivilStatusRepository civilStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Civil_status> civilStatusList(){
        return civilStatusDao.findAll();
    }
}
