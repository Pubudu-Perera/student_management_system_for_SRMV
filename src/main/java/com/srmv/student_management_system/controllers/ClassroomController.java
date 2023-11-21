package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.ClassName;
import com.srmv.student_management_system.entities.Classroom;
import com.srmv.student_management_system.entities.ClassroomStatus;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.ClassNameRepository;
import com.srmv.student_management_system.repositories.ClassroomRepository;
import com.srmv.student_management_system.repositories.ClassroomStatusRepository;
import com.srmv.student_management_system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/classroom")
public class ClassroomController {

    @Autowired
    private ClassroomRepository classDao;

    @Autowired
    private ClassroomStatusRepository classroomStatusDao;

    @Autowired
    private ClassNameRepository classNameDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;



    @GetMapping
    public ModelAndView classroomUI(){
        ModelAndView classroomUI = new ModelAndView();
        classroomUI.setViewName("Classroom.html");
        return classroomUI;
    }


    @GetMapping(value = "/list")
    public List<Classroom> getClassroomList(){
       return classDao.findAll();
    }


    @GetMapping(value = "/byGrade/{grade_id}")
    public List<Classroom> classroomsByGrade(@PathVariable("grade_id") Integer grade_id){
        return classDao.classroomsByGrade(grade_id);
    }

    @GetMapping(value = "/active_list", produces = "application/json")
    public List<Classroom> getActiveClassroomList(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken){
            return null;
        }


        return classDao.classroomList();
    }



//    getting Classroom status service
    @GetMapping(value = "/classroomStatusList", produces = "application/json")
    public List<ClassroomStatus> getClassroomStatusList(){
        return classroomStatusDao.findAll();
    }



// to edit classroom record
    @GetMapping(value = "/getByID")
    public Classroom getClassByID(@RequestParam("id") Integer id){
        return classDao.getReferenceById(id);
    }



// fetch class name list ( ex-: A,B,C,D)
    @GetMapping(value = "/class_name/list")
    public List<ClassName> getClassNameList(){
        return classNameDao.findAll();
    }


//classrooms by Grade
    @GetMapping(value = "/classrooms_by_grade/{grade_id}")
    public List<Classroom> getClassroomsByGrade(@PathVariable("grade_id") Integer grade_id){
        return classDao.classroomsByGrade(grade_id);
    }



    @PostMapping
    public String submitClassroom(@RequestBody Classroom classroom){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Classroom");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("insert")) {

            try {
                classroom.setAdded_date(LocalDateTime.now());
                classroom.setAdded_user(loggedUser);
                classDao.save(classroom);
                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation! ";
        }
    }



    @DeleteMapping
    public String deleteClassroom(@RequestBody Classroom classroom){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Classroom");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("delete")) {

            try {
                classroom.setDeleted_date(LocalDateTime.now());
                classroom.setClassroom_status_id(classroomStatusDao.getReferenceById(3));
                classDao.save(classroom);
                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation! ";
        }
    }



    @PutMapping
    public String updateClassroom(@RequestBody Classroom classroom){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Classroom");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("update")) {
            try {
                classroom.setLast_update(LocalDateTime.now());
                classDao.save(classroom);
                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation! ";
        }
    }
}
