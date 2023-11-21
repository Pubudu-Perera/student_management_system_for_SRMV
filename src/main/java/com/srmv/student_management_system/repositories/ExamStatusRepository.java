package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamStatusRepository extends JpaRepository<ExamStatus,Integer> {
}
