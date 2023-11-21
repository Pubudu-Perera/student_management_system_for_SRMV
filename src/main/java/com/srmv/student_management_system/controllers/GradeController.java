package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Grade;
import com.srmv.student_management_system.repositories.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "grade")
public class GradeController {

    @Autowired
    GradeRepository gradeDao;

    @GetMapping(value = "/list", produces = "application/json" )
    public List<Grade> getGrade(){
        return gradeDao.findAll();
    }
}
