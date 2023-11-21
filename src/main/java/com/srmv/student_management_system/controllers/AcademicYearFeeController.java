package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.AcademicYearFee;
import com.srmv.student_management_system.repositories.AcademicYearFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.DecimalFormat;
import java.util.List;

@RestController
@RequestMapping(value = "/academic_year_fee")
public class AcademicYearFeeController {

    @Autowired
    private AcademicYearFeeRepository academicYearFeeDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<AcademicYearFee> getAcademicYearFee(){
        return academicYearFeeDao.findAll();
    }

    @GetMapping(value = "/acfBySS/{aca_year_id}")
    public AcademicYearFee getAcademicYearFeeBySS(@PathVariable Integer aca_year_id){
        System.out.println(academicYearFeeDao.academicYearFeeBySubsection(aca_year_id));
        return academicYearFeeDao.academicYearFeeBySubsection(aca_year_id);
    }
}
