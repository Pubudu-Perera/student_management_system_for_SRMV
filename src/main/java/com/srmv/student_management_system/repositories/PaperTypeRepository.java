package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.PaperType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaperTypeRepository extends JpaRepository<PaperType,Integer> {
}
