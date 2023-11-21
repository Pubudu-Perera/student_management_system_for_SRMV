package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.AttendanceHasStudents;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceHasStudentsRepository extends JpaRepository<AttendanceHasStudents,Integer> {
}
