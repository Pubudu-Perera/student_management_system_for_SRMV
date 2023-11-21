package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.ClassroomStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassroomStatusRepository extends JpaRepository<ClassroomStatus,Integer> {
}
