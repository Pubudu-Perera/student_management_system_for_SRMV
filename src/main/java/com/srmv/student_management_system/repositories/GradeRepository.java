package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeRepository extends JpaRepository<Grade,Integer> {
}
