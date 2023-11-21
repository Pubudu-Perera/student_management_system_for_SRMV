package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Employee;
import com.srmv.student_management_system.entities.Teacher;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.EmployeeRepository;
import com.srmv.student_management_system.repositories.TeacherRepository;
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
@RequestMapping(value = "/teacher")
public class TeacherController {

    @Autowired
    private TeacherRepository teacherDao;

    @Autowired
    private EmployeeRepository employeeDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping
    public ModelAndView teacherUI(){
        ModelAndView teacherUI = new ModelAndView();
        teacherUI.setViewName("Teacher.html");
        return teacherUI;
    }


//    Service for get teachers list from teachers Module
    @GetMapping(value = "/list", produces = "application/json")
    public List<Teacher> getTeacherList(){
        return teacherDao.findAll();
    }

    @GetMapping(value = "/classroom_teachers")
    public List<Employee> getClassroomTeacherList(){
        return employeeDao.classroomTeachers();
    }

    @PostMapping
    @Transactional
    public String addTeacher(@RequestBody Teacher teacher){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Teacher");

        if (userPrivileges != null && userPrivileges.get("insert")){
            try{
                teacher.setAdded_user(loggedUser);
                teacher.setAdded_date(LocalDateTime.now());
                teacherDao.save(teacher);
                return "0";
            }catch (Exception e){
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation";
        }

    }

}
