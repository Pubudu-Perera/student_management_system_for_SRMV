package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.StudentRegistrationHasSubjects;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRegistrationHasSubjectsRepository extends JpaRepository<StudentRegistrationHasSubjects,Integer> {
}
