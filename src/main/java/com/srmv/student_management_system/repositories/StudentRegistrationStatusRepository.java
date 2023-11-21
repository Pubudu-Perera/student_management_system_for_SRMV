package com.srmv.student_management_system.repositories;


import com.srmv.student_management_system.entities.StudentRegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRegistrationStatusRepository extends JpaRepository<StudentRegistrationStatus,Integer> {
}
