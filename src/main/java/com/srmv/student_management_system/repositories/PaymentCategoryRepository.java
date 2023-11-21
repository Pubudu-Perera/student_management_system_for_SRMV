package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.PaymentCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentCategoryRepository extends JpaRepository<PaymentCategory,Integer> {
}
