package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.UserRole;
import com.srmv.student_management_system.repositories.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping(value = "/role")
public class UserRoleController {

    @Autowired
    private UserRoleRepository userRoleDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<UserRole> roleFindAll(){
        return userRoleDao.findAll();
    }

//    fetch the roles data according to the user
    @GetMapping(value = "/getByUserID/{user_id}", produces = "application/json")
    public List<UserRole> roleListByUser(@PathVariable("user_id") Integer user_id){
       return userRoleDao.getRoleByUserId(user_id);
    }
}
