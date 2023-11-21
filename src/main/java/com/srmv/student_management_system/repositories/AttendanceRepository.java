package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance,Integer> {

}
