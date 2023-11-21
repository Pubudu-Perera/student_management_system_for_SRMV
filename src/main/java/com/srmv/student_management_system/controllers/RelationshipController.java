package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Relationship;
import com.srmv.student_management_system.repositories.RelationshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/relationship")
public class RelationshipController {

    @Autowired
    private RelationshipRepository relationshipDao;


    @GetMapping(value = "/list", produces = "application/json")
    public List<Relationship> getRelationship(){
        return relationshipDao.findAll();
    }
}
