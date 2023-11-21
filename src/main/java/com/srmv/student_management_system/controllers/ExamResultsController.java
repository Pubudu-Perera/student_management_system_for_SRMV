package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.ExamResultHasStudents;
import com.srmv.student_management_system.entities.ExamResults;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.ExamResultsHasStudentsRepository;
import com.srmv.student_management_system.repositories.ExamResultsRepository;
import com.srmv.student_management_system.repositories.ExamResultsStatusRepository;
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
@RequestMapping(value = "exam_results")
public class ExamResultsController {

    @Autowired
    private ExamResultsRepository examResultsDao;

    @Autowired
    private ExamResultsStatusRepository examResultsStatusDao;

    @Autowired
    private ExamResultsHasStudentsRepository examResultsHasStudentsDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping
    public ModelAndView examResultsUI() {
        ModelAndView examResultsUI = new ModelAndView();
        examResultsUI.setViewName("ExamResults.html");
        return examResultsUI;
    }


    @GetMapping(value = "/list")
    public List<ExamResults> getExamResults() {
        return examResultsDao.findAll();
    }



    @PostMapping
    @Transactional
    public String submitResults(@RequestBody ExamResults examResults){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"ExamResults");

        if (userPrivileges != null && userPrivileges.get("insert")){
            try {
                examResults.setAdded_date(LocalDateTime.now());
                examResults.setAdded_user(loggedUser);

                ExamResults newExamresults = examResultsDao.saveAndFlush(examResults);

                for (ExamResultHasStudents erhs : examResults.getExamResultHasStudentsList()){
                    erhs.setExam_results_id(newExamresults);
                    examResultsHasStudentsDao.save(erhs);
                }

                return "0";
            }catch (Exception e){
                return e.getMessage();
            }

        }else {
            return "You don't have privileges to do this operation!";
        }

    }



    @DeleteMapping
    public String deleteExamResultRecord(@RequestBody ExamResults examResults){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"ExamResults");

        if (userPrivileges != null && userPrivileges.get("delete")){
            try {
                examResults.setDeleted_date(LocalDateTime.now());
                examResults.setExam_results_status_id(examResultsStatusDao.getReferenceById(3));
                examResultsDao.save(examResults);
                return "0";
            }catch (Exception e){
                return e.getMessage();
            }

        }else {
            return "You don't have privileges to do this operation!";
        }
    }
}









