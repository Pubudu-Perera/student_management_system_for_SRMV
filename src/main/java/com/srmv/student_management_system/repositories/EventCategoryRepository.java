package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventCategoryRepository extends JpaRepository<EventCategory,Integer> {
}
