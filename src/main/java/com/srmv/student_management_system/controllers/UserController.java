package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.entities.UserHasRoles;
import com.srmv.student_management_system.entities.UserRole;
import com.srmv.student_management_system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.management.relation.Role;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

@RestController  //Indicates REST API is using
@RequestMapping("/user") //final part of the URL
public class UserController {

    @Autowired
    public UserRepository userDao;

    @Autowired
    public BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping
    public ModelAndView userUI(){
        ModelAndView userModule = new ModelAndView();
        userModule.setViewName("User.html");
        return userModule;
    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<User> userFindAll(){
        return userDao.getUserList();
    }

    @GetMapping(value = "/getByUserID")
    public User getUserByID(@RequestParam("id") Integer id){
        return userDao.getReferenceById(id);
    }



//    Mapping for submit the user
    @PostMapping
    @Transactional
    public String addUser(@RequestBody User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User loggedUser = userDao.findUserByUsername(authentication.getName());

        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"User");

        if (userPrivileges != null && userPrivileges.get("insert")) {

                try {
                    user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
                    user.setAdded_date(LocalDateTime.now());
                    userDao.save(user);
                    return "0";
                } catch (Exception e) {
                    return e.getMessage();
                }

        }else {
            return "You don't have privileges to do this operation! ";
        }
    }



    @DeleteMapping
    public String deleteUser(@RequestBody User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"User");


        if (userPrivileges != null && userPrivileges.get("delete")) {

            User deletedUser = userDao.getReferenceById(user.getId());

            if (deletedUser != null) {

                try {
                    deletedUser.setUser_status(false);
                    deletedUser.setDeleted_date(LocalDateTime.now());
                    userDao.save(deletedUser);
                    return "0";
                } catch (Exception e) {
                    return "Error! The User record can not be deleted!" + e.getMessage();
                }
            } else {
                return "The user record does not exist!";
            }
        }else {
            return "You don't have privileges to do this operation!";
        }
    }



    @PutMapping
    public String updateUser(@RequestBody User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"User");

        if (userPrivileges != null && userPrivileges.get("update")) {

            User updatingUser = userDao.getReferenceById(user.getId());

            if (updatingUser != null) {

                try {
                    updatingUser.setLast_update(LocalDateTime.now());
                    userDao.save(updatingUser);
                    return "0";
                } catch (Exception e) {
                    return "Error! The User record can not be updated!" + e.getMessage();
                }
            } else {
                return "The user record does not exist!";
            }
        }else {
            return "You don't have privileges to do this operation!";
        }

    }

}
