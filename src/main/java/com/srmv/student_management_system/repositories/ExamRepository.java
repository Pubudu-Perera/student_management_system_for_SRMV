package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ExamRepository extends JpaRepository<Exam,Integer> {


}
