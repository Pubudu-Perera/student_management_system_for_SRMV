package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Guardian;
import com.srmv.student_management_system.entities.GuardianStatus;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.GuardianRepository;
import com.srmv.student_management_system.repositories.GuardianStatusRepository;
import com.srmv.student_management_system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController //this allows us to handle all the requests such as GET,POST,PUT & DELETE... .
@RequestMapping("/guardian") //all the services in this Guardian controller class can be accessed by "../guardian" url
public class GuardianController {

@Autowired
private GuardianRepository guardianDao;

@Autowired
private GuardianStatusRepository guardianStatusDao;

@Autowired
private UserRepository userDao;

@Autowired
private PrivilegeController privilegeController;



//    get the guardian object according to the NIC. request mapping for get guardian by given ID (if there exists)(url = "guardian/getByID/id=1")
//    This mapping is for check the ID is already in the database. It is executed when the user enter valid NIC number
    @GetMapping(value = "/getByNIC/{nic}", produces = "application/json")
    public Guardian getByNIC(@PathVariable("nic") String nic){
        return guardianDao.findGuardianByNic(nic);
    }


    @GetMapping(value = "/findall")
    public List<Guardian> guardianFullList(){
        return guardianDao.findAll();
    }

    //    retrieve all the guardian tables data from the database
    @GetMapping(value = "/large_list",produces = "application/json")
    public List<Guardian> guardianFindAll(){
        return guardianDao.guardianLargeList();
    }



    //    for student form's select field
    @GetMapping(value = "/list", produces = "application/json")
    public List<Guardian> guardianList(){
        return guardianDao.guardianList();
    }



    //set the guardian.html UI to "../guardian"  url
    @GetMapping
    public ModelAndView guardianUI(){
        ModelAndView guardianModule = new ModelAndView();
        guardianModule.setViewName("Guardian.html");
        return guardianModule;
    }



    //request mapping for get guardian by given ID (if there exists)(url = "guardian/getByID/id=1")
    @GetMapping(value = "/getByID")
    public Guardian getByID(@RequestParam("id") Integer id){
        return guardianDao.getReferenceById(id);
    }


//    Getting guardian status
    @GetMapping(value = "/guardian_status_list")
    public List<GuardianStatus> getGuardianStatusList(){
        return guardianStatusDao.findAll();
    }


//    submit the form data to the database
    @PostMapping
    public String addGuardian(@RequestBody Guardian guardian){

//        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Guardian");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("insert")) {

//        check the nic already exist in the database
            Guardian existNIC = guardianDao.findGuardianByNic(guardian.getNic());

            if (existNIC != null) {
                return "The NIC number you just entered is already available in the system! ";
            }

            try {
                guardian.setAdded_date(LocalDateTime.now());
                guardian.setAdded_user(loggedUser);
                guardianDao.save(guardian);
                return "0";
            } catch (Exception e) {
                return "Error! You can't add this guardian record now! Please try again! \n" + e.getMessage();
            }
        }
        return "You don't have privileges to do this operation! ";
    }



//service for delete record from the table
    @DeleteMapping
    public String deleteGuardian(@RequestBody Guardian guardian){

        //        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Guardian");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("delete")) {


//        check the guardian exists or not
            Guardian deletedGuardian = guardianDao.getReferenceById(guardian.getId());

            if (deletedGuardian != null) {
                try {
                    deletedGuardian.setDeleted_date(LocalDateTime.now());
                    deletedGuardian.setGuardian_status_id(guardianStatusDao.getReferenceById(3));
                    guardianDao.save(deletedGuardian);
                    return "0";
                } catch (Exception e) {
                    return "The guardian is already deleted from the system OR In-active" + e.getMessage();
                }
            } else {
                return "Error! The guardian doesn't exist in the system!";
            }
        }
        return "You don't have privileges to do this operation! ";
    }



//    update guardian record
    @PutMapping
    public String updateGuardian(@RequestBody Guardian guardian){

        //Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Guardian");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("update")) {
            Guardian extGuardian = guardianDao.getReferenceById(guardian.getId());

            if (extGuardian != null) {

                try {
                    guardian.setLast_update(LocalDateTime.now());
                    guardianDao.save(guardian);
                    return "0";
                } catch (Exception e) {
                    return "Error! Can't update this guardian record now! Please try again!" + e.getMessage();
                }
            } else {
                return "The Guardian does not exist!";
            }
        }
        return "You don't have privileges to do this operation! ";
    }
}
