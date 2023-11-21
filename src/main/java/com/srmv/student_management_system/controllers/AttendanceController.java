package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Attendance;

import com.srmv.student_management_system.entities.AttendanceHasStudents;
import com.srmv.student_management_system.repositories.AttendanceHasStudentsRepository;
import com.srmv.student_management_system.repositories.AttendanceRepository;

import com.srmv.student_management_system.repositories.PrivilegeRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceDao;

    @Autowired
    private AttendanceHasStudentsRepository attendanceHasStudentsDao;

    @Autowired
    private PrivilegeRepository privilegeDao;

    @GetMapping
    public ModelAndView attendanceUI(){
        ModelAndView attendanceUI = new ModelAndView();
        attendanceUI.setViewName("Attendance.html");
        return attendanceUI;
    }


    @GetMapping(value = "/list", produces = "application/json")
    public List<Attendance> getAttendance(){
        return attendanceDao.findAll();
    }



    @PostMapping
    @Transactional
    public String addAttendance(@RequestBody Attendance attendance){


        try{
            Attendance newAttendance = attendanceDao.saveAndFlush(attendance);

            for (AttendanceHasStudents ahs : attendance.getAttendanceHasStudentsList()){
                ahs.setAttendance_id(newAttendance);
                attendanceHasStudentsDao.save(ahs);
            }
            return "0";
        }catch (Exception e){
            return e.getMessage();
        }

    }
}
