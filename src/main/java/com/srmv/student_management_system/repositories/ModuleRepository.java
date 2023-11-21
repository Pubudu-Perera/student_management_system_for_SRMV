package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Module;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<Module,Integer> {
}
