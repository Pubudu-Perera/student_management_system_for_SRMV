package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Guardian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuardianRepository extends JpaRepository<Guardian,Integer> {

    @Query(value = "SELECT new Guardian(g.id, g.name_with_initials, g.mobile,g.permanent_address, g.relationship_id, g.guardian_status_id) FROM Guardian AS g ORDER BY g.id DESC ")
    List<Guardian> guardianLargeList();


    @Query(value = "SELECT new Guardian(g.id, g.full_name) FROM Guardian AS g ORDER BY g.id DESC")
    List<Guardian> guardianList();

//    following query is for auto generate next guardian_no of the guardian table in database.
//    Here the Guardian is entity class
//    Don't forget to use nativeQuery clause
//    nextGuardian_no() is called at PostMapping service method in GuardianController class
    @Query(value = "SELECT lpad(max(g.guardian_no)+1,6,'0') FROM Guardian AS g" , nativeQuery = true)
    String nextGuardian_no();


//    check the guardian NIC already exist in the database
//    Here we check if there is any object with user added NIC.
//    called at GuardianController class
    Guardian findGuardianByNic(String nic);

}
