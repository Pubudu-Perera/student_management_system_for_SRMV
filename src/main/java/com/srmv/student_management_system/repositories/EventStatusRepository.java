package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventStatusRepository extends JpaRepository<EventStatus,Integer> {
}
