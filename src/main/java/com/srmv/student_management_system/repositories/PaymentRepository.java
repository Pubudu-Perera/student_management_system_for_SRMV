package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentRepository extends JpaRepository<Payment,Integer> {

//    auto generate the next bill number for next transaction
    @Query(value = "SELECT lpad(max(sp.bill_number)+1,6,'0') FROM mydb.student_payment sp",nativeQuery = true)
    String nextBillNumber();


}
