package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.StudentRegistration;
import com.srmv.student_management_system.entities.StudentRegistrationStatus;
import com.srmv.student_management_system.entities.Teacher;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.StudentRegistrationRepository;
import com.srmv.student_management_system.repositories.StudentRegistrationStatusRepository;
import com.srmv.student_management_system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/student_registration")
public class StudentRegistrationController {

    @Autowired
    private StudentRegistrationRepository studentRegistrationDao;

    @Autowired
    private StudentRegistrationStatusRepository studentRegistrationStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping
    public ModelAndView studentRegistrationUI(){
        ModelAndView studentRegistrationUI = new ModelAndView();
        studentRegistrationUI.setViewName("StudentRegistration.html");
        return studentRegistrationUI;
    }

    @GetMapping(value = "/list")
    public List<StudentRegistration> studentRegistrationList(){
        return studentRegistrationDao.findAll();
    }

//    service to fetch student registration status
    @GetMapping(value = "/student_registration_status/list")
    public List<StudentRegistrationStatus> studentRegistrationStatusList(){
        return studentRegistrationStatusDao.findAll();
    }


//    get registration record according to the registration id
//    public StudentRegistration
    @PostMapping
    @Transactional
    public String addStudentRegistration(@RequestBody StudentRegistration studentRegistration){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"StudentRegistration");

        if (userPrivileges != null && userPrivileges.get("insert")){
            try{
                studentRegistration.setAdded_user(loggedUser);
                studentRegistration.setAdded_date(LocalDateTime.now());
                studentRegistrationDao.save(studentRegistration);
                return "0";
            }catch (Exception e){
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation";
        }

    }



    @DeleteMapping
    public String deleteUser(@RequestBody StudentRegistration studentRegistration){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"StudentRegistration");


        if (userPrivileges != null && userPrivileges.get("delete")) {

                try {
                    studentRegistration.setStudent_registration_status_id(studentRegistrationStatusDao.getReferenceById(4));
                    studentRegistration.setDeleted_date(LocalDateTime.now());
                    studentRegistrationDao.save(studentRegistration);
                    return "0";
                } catch (Exception e) {
                    return e.getMessage();
                }

        }else {
            return "You don't have privileges to do this operation!";
        }
    }

}
