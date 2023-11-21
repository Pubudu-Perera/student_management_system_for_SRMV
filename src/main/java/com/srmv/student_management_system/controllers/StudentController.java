package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Race;
import com.srmv.student_management_system.entities.Religion;
import com.srmv.student_management_system.entities.Student;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.RaceRepository;
import com.srmv.student_management_system.repositories.ReligionRepository;
import com.srmv.student_management_system.repositories.StudentRepository;
import com.srmv.student_management_system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/student")
public class StudentController {

    @Autowired
    private StudentRepository studentDao;

    @Autowired
    private ReligionRepository religionDao;

    @Autowired
    private RaceRepository raceDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;


//Fetch the HTML file for Student Module
    @GetMapping
    public ModelAndView studentUI(){
        ModelAndView studentModule = new ModelAndView();
        studentModule.setViewName("Student.html");
        return studentModule;
    }



//
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Student> studentFindAll(){
        return studentDao.findAll();
    }



//fetch the student according to his student id
//for updateStudentRecord() function
    @GetMapping(value = "/getByID", produces = "application/json")
    public Student getByID(@RequestParam("id") Integer id){
        return studentDao.getReferenceById(id);
    }



//    students by registered classroom
    @GetMapping("/byClassroom/{classroom_id}")
    public List<Student> getStudentsByClassroom(@PathVariable Integer classroom_id){
        return studentDao.getStudentsByClassroom(classroom_id);
    }



// Service to get Religion list
    @GetMapping(value = "/religionList", produces = "application/json")
    public List<Religion> religionList(){
        return religionDao.findAll();
    }



// Service to get religion list'
    @GetMapping(value = "/raceList", produces = "application/json")
    public List<Race> raceList(){
        return raceDao.findAll();
    }


    @GetMapping(value = "/studentListForReg")
    public List<Student> getStudentListForReg(){
        return studentDao.getStudentsWithoutClass();
    }



    @PostMapping
    public String addStudent(@RequestBody Student student){
//        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Student");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("insert")) {
            try {
                student.setRegistration_no(studentDao.nextRegNo());
                student.setAdded_date(LocalDateTime.now());
                student.setAdded_user(loggedUser);
                studentDao.save(student);
                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        }
        return "You don't have privileges to do this operation!";
    }



    @DeleteMapping
    public String deleteStudent(@RequestBody Student student){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"delete");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("update")) {

            Student deletedStudent = studentDao.getReferenceById(student.getId());

            if (deletedStudent != null) {
                try {
                    deletedStudent.setDeleted_date(LocalDateTime.now());
                    deletedStudent.setStudent_status(false);
                    studentDao.save(deletedStudent);
                    return "0";
                } catch (Exception e) {
                    return "Student record can not be deleted!" + e.getMessage();
                }
            } else {
                return "Student record can not be deleted!";
            }
        }
        return "You don't have privileges to do this operation!";
    }



    @PutMapping
    public String updateStudent(@RequestBody Student student) {

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting privilege object
        HashMap<String, Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(), "update");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("update")) {
            Student extStudent = studentDao.getReferenceById(student.getId());

            if (extStudent != null) {
                try {
                    student.setLast_update(LocalDateTime.now());
                    studentDao.save(student);
                    return "0";
                } catch (Exception e) {
                    return "The Student record can not be updated! " + e.getMessage();
                }
            } else {
                return "The Student record does not exist in the system!";
            }
        }
        return "You don't have privileges to do this operation!";
    }

}
