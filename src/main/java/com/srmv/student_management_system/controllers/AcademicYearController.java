package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.AcademicYear;
import com.srmv.student_management_system.entities.AcademicYearHasEvents;
import com.srmv.student_management_system.entities.AcademicYearStatus;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/academic_year")
public class AcademicYearController {

    @Autowired
    private AcademicYearRepository academicYearDao;

    @Autowired
    private AcademicYearStatusRepository academicYearStatusDao;

    @Autowired
    private AcademicYearHasEventsRepository academicYearHasEventsDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;


    @GetMapping
    public ModelAndView academicYearUI(){
        ModelAndView academicYearUI = new ModelAndView();
        academicYearUI.setViewName("Academic_Year.html");
        return academicYearUI;
    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<AcademicYear> getAcademicYears(){
        return academicYearDao.findAll();
    }

    @GetMapping(value = "/aca_status_list", produces = "application/json")
    public List<AcademicYearStatus> getAcademicYearStatus(){
        return academicYearStatusDao.findAll();
    }

//    getting ongoing academic years
    @GetMapping(value = "/activeAcademicYear")
    public List<AcademicYear> getOngoingAcaYear(){
        return academicYearDao.activeAcademicYear();
    }




    @PostMapping
    @Transactional
    public String addAcademicYear(@RequestBody AcademicYear academicYear){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User loggedUser = userDao.findUserByUsername(authentication.getName());

        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"AcademicYear");

        if (userPrivileges != null && userPrivileges.get("insert")) {
            try {

                academicYear.setAdded_user(loggedUser);
                academicYear.setAdded_date(LocalDate.now());

                AcademicYear newAcademicYear = academicYearDao.saveAndFlush(academicYear);
                for (AcademicYearHasEvents ayHasE : academicYear.getAcademicYearHasEventsList()) {
                    ayHasE.setAcademic_year_id(newAcademicYear);
                    academicYearHasEventsDao.save(ayHasE);
                }


                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation! ";
        }
    }



    @DeleteMapping
    public String deleteAcaYear(@RequestBody AcademicYear academicYear){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(), "AcademicYear");

        if (userPrivileges != null && userPrivileges.get("delete")) {

            AcademicYear extAcaYear = academicYearDao.getReferenceById(academicYear.getId());

            if (extAcaYear != null) {

                try {
                    academicYear.setDeleted_date(LocalDateTime.now());
                    academicYear.setAca_status_id(academicYearStatusDao.getReferenceById(4));
                    academicYearDao.save(academicYear);
                    return "0";
                } catch (Exception e) {
                    return e.getMessage();
                }
            } else {
                return "the record does not exist!";
            }
        } else {
            return "You don't have privileges to do this operation! ";
        }
    }
}
