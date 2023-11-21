package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Module;
import com.srmv.student_management_system.repositories.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/module")
public class ModuleController {

    @Autowired
    private ModuleRepository moduleDao;

    @GetMapping(value = "/list")
    public List<Module> moduleList(){
        return moduleDao.findAll();
    }
}
