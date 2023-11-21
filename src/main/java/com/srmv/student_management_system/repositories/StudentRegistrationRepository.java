package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.StudentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StudentRegistrationRepository extends JpaRepository<StudentRegistration,Integer> {

//    Query to get total fee for am academic year by registered student
    @Query(value = "SELECT str FROM StudentRegistration str WHERE str.id = :stu_reg_id")
    StudentRegistration totalFeeByStudent(@Param("stu_reg_id") Integer stu_reg_id);
}
