package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Subjects;
import com.srmv.student_management_system.repositories.SubjectsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/subject")
public class SubjectController {

    @Autowired
    private SubjectsRepository subjectDao;

    @GetMapping(value = "/list")
    public List<Subjects> subjectsList(){
        return subjectDao.findAll();
    }

    @GetMapping(value = "/teaching_subjects")
    public List<Subjects> distinctSubjectsLink(){
        return subjectDao.distinctSubjects();
    }


    @GetMapping(value = "/getByTeacherID/{id}")
    public List<Subjects> subjectsByTeacherID(@PathVariable("id") Integer id){
        return subjectDao.getSubjectsByTeacherID(id);
    }

    @GetMapping(value = "/getByGradeID/{grade_id}")
    public List<Subjects> subjectsByGradeID(@PathVariable("grade_id") Integer grade_id){
        return  subjectDao.getSubjectsByGradeID(grade_id);
    }

    @GetMapping(value = "/getByStudentRegistrationID/{student_registration_id}")
    public List<Subjects> subjectsByStudentRegistrationID(@PathVariable("student_registration_id") Integer student_registration_id){
        return subjectDao.getSubjectsByStudent(student_registration_id);
    }
}
