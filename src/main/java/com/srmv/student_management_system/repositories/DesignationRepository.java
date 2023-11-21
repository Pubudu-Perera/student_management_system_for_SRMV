package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Designation;
import com.srmv.student_management_system.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignationRepository extends JpaRepository<Designation,Integer> {

}
