package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Privilege;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.PrivilegeRepository;
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
@RequestMapping(value = "/privilege")
public class PrivilegeController {

    @Autowired
    private PrivilegeRepository privilegeDao;

    @Autowired
    private UserRepository userDao;



    @GetMapping
    public ModelAndView privilegeUI(){
        ModelAndView privilegeUi = new ModelAndView();
        privilegeUi.setViewName("Privilege.html");
        return privilegeUi;
    }



    @GetMapping(value = "/list")
    public List<Privilege> privilegeList(){
        return privilegeDao.findAll();
    }



//service for getting privilege record
//    Used at editPrivilegeRecord() function
    @GetMapping(value = "/getByID")
    public Privilege getByID(@RequestParam("id") Integer id){
        return privilegeDao.getReferenceById(id);
    }





    @PostMapping
    public String addPrivilege(@RequestBody Privilege privilege) {

        //check privileges for logged user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivileges = getPrivilegeOfUser(authentication.getName(), "Privilege");

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

        if (userPrivileges != null && userPrivileges.get("insert")) {

            Privilege existPrivilege = privilegeDao.getByRoleAndModuleID(privilege.getRoles_id().getId(), privilege.getModule_id().getId());

            if (existPrivilege == null) {
                try {
                    privilege.setAdded_date(LocalDateTime.now());
                    privilegeDao.save(privilege);
                    return "0";
                } catch (Exception e) {
                    return e.getMessage();
                }
            }else {
                return "already exist!";
            }
        }else {
            return "You don't have privileges to do this operation";
        }
    }



    @DeleteMapping
    public String deletePrivilegeRecord(@RequestBody Privilege privilege) {

        //check privileges for logged user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivileges = getPrivilegeOfUser(authentication.getName(), "Privilege");
        Privilege existprivilege = privilegeDao.getReferenceById(privilege.getId());

        if (userPrivileges != null && userPrivileges.get("delete")) {

            if (existprivilege != null) {
                try {
                    privilege.setDeleted_date(LocalDateTime.now());
                    privilegeDao.delete(privilege);
                    return "0";
                } catch (Exception e) {
                    return e.getMessage();
                }
            }
            return "The Privilege record does not exist!";
        }
        return "You have no privileges to delete this record!";
    }


    @PutMapping
    public String updatePrivilegeRecord(@RequestBody Privilege privilege){

        //check privileges for logged user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivileges = getPrivilegeOfUser(authentication.getName(), "Privilege");

        if (userPrivileges != null && userPrivileges.get("update")) {
            Privilege existprivilege = privilegeDao.getReferenceById(privilege.getId());

            if (existprivilege != null) {
                try {
                    privilege.setLast_update(LocalDateTime.now());
                    privilegeDao.save(privilege);
                    return "0";
                } catch (Exception e) {
                    return e.getMessage();
                }
            }else {
                return "The record does not exist!";
            }
        }else {
            return "You don't have privileges to do this operation";
        }
    }


//This is the function for check whether logged user has privileges
    public HashMap<String,Boolean> getPrivilegeOfUser(String username,String moduleName){

        User loggeduser = userDao.findUserByUsername(username);
        HashMap<String,Boolean> userPrivileges = new HashMap<>();
        if (loggeduser != null){
            if (loggeduser.getUsername().equals("admin")){
                userPrivileges.put("select",true);    //For the administrator
                userPrivileges.put("update",true);
                userPrivileges.put("insert",true);
                userPrivileges.put("delete",true);
            }else {
                String privileges = privilegeDao.getPrivilegeByUserModule(moduleName,loggeduser.getUsername());
                String[] privilegesList = privileges.split(",");

                userPrivileges.put("select",privilegesList[0].equals("1"));
                userPrivileges.put("update",privilegesList[1].equals("1"));
                userPrivileges.put("insert",privilegesList[2].equals("1"));
                userPrivileges.put("delete",privilegesList[3].equals("1"));
                System.out.println(privileges);
            }
        }else {
            userPrivileges.put("select",false);    //For not the users in the system
            userPrivileges.put("update",false);
            userPrivileges.put("insert",false);
            userPrivileges.put("delete",false);
        }
        return userPrivileges;
    }
}
