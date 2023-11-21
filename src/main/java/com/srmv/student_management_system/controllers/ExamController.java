package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.*;
import com.srmv.student_management_system.repositories.*;
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
@RequestMapping(value = "/exam")
public class ExamController {

    @Autowired
    private ExamRepository examDao;

    @Autowired
    private ExamStatusRepository examStatusDao;

    @Autowired
    private PaperTypeRepository paperTypeDao;

    @Autowired
    private ExamHasSubjectsRepository examHasSubjectsDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;


    @GetMapping
    public ModelAndView examUI(){
        ModelAndView examUI = new ModelAndView();
        examUI.setViewName("Exam.html");
        return examUI;
    }



    @GetMapping(value = "/list")
    public List<Exam> examList(){
        return  examDao.findAll();
    }



//    Getting the list of exam status
    @GetMapping(value = "/examStatusList")
    public List<ExamStatus> examStatusList(){
        return examStatusDao.findAll();
    }



//    getting the exam record to edit according to its ID
    @GetMapping(value = "/getByID")
    public Exam getExamRecordById(@RequestParam("id") Integer id){
        return examDao.getReferenceById(id);
    }



//getting paper type list
   @GetMapping(value = "/paperTypeList")
   public List<PaperType> paperTypeList(){
        return paperTypeDao.findAll();
   }



//    service for delete exam record
    @DeleteMapping
    public String deleteExam(@RequestBody Exam exam){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Exam");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("delete")) {
            try {
                exam.setDeleted_date(LocalDateTime.now());
                exam.setExam_status_id(examStatusDao.getReferenceById(4));
                examDao.save(exam);
                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation! ";
        }
    }



//    service for submit
    @PostMapping
    @Transactional
    public String addExam(@RequestBody Exam exam){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Exam");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("insert")) {
            try {
                exam.setAdded_date(LocalDateTime.now());
                exam.setAdded_user(loggedUser);
                Exam newExam = examDao.saveAndFlush(exam);

                for (ExamHasSubjects eHs : exam.getExamHasSubjectsList()) {
                    eHs.setExam_id(newExam);
                    examHasSubjectsDao.save(eHs);
                }
                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation! ";
        }
    }



//    service for edit exam record
    @PutMapping
    public String updateExam(@RequestBody Exam exam){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Exam");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("update")) {
            try {
                exam.setLast_update(LocalDateTime.now());
                examDao.save(exam);
                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation! ";
        }
    }
}
