package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.repositories.AcademicYearHasEventsRepository;
import com.srmv.student_management_system.repositories.AcademicYearStatusRepository;
import com.srmv.student_management_system.repositories.PrivilegeRepository;
import com.srmv.student_management_system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping(value = "/report_result")
public class ReportStudentResultsController {

    @Autowired
    private AcademicYearStatusRepository academicYearStatusDao;

    @Autowired
    private AcademicYearHasEventsRepository academicYearHasEventsDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeRepository privilegeDao;


    @GetMapping
    public ModelAndView employeeReportUI(){
        ModelAndView reportEmployeeUI = new ModelAndView();
        reportEmployeeUI.setViewName("StudentResultsReport.html");
        return reportEmployeeUI;
    }
}
