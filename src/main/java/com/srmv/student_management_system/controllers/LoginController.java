package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.LoggedUser;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;

@RestController
public class LoginController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserRepository userDao;



        //service for fetch login form when user start to log in to the system
        @GetMapping(value = "/login")
        public ModelAndView loginUI(){
              ModelAndView loginUI = new ModelAndView();
              loginUI.setViewName("Login.html");
              return loginUI;
        }


    @GetMapping(value = "/log_out")
    public ModelAndView logOutUI(){
        ModelAndView logOutUI = new ModelAndView();
        logOutUI.setViewName("Login.html");
        return logOutUI;
    }



    //service for fetch dashboard/main window when user start to log in to the system
//    declared the service in same login file because the dashboard should be loaded with the login form
    @GetMapping(value = "/dashboard")
    public ModelAndView dashboardUI(){
        ModelAndView dashboardUI = new ModelAndView();
        dashboardUI.setViewName("Index.html");
        return dashboardUI;
    }



    //service for fetch access_denied window when unauthorized user start to log in to the system
// service used in web configuration file
    @GetMapping(value = "/access_denied")
    public ModelAndView accessDeniedUI(){
        ModelAndView accessDeniedUI = new ModelAndView();
        accessDeniedUI.setViewName("AccessDenied403.html");
        return accessDeniedUI;
    }



//    Service for access logged user
    @GetMapping(value = "/logged_user")
        public LoggedUser getLogUser(){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentLoggedUser = userDao.findUserByUsername(authentication.getName());

        LoggedUser logUser = new LoggedUser();

        logUser.setUsername(currentLoggedUser.getUsername());
        logUser.setRole(currentLoggedUser.getRoles().iterator().next().getName());
//        logUser.setPhotoName(currentLoggedUser.getPhoto());
//        logUser.setPhotoPath(currentLoggedUser.getPhoto_path());

        return logUser;
    }



    @GetMapping(value = "logUserModulePrivilege/byModule/{moduleName}")
    public HashMap<String,Boolean> getPrivilegeByModule(@PathVariable("moduleName")String moduleName){
        Authentication userAuthentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilege = privilegeController.getPrivilegeOfUser(userAuthentication.getName(),moduleName);
        return userPrivilege;
    }


}
