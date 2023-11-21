package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilegeRepository extends JpaRepository<Privilege,Integer> {

//The query is for getting privilege object by given role id & module id
    @Query(value = "SELECT p FROM Privilege AS p WHERE p.roles_id.id=?1 AND p.module_id.id=?2")
    Privilege getByRoleAndModuleID(Integer role_id, Integer module_id);



//    Method for get privileges according to the user module
    @Query(value = "SELECT BIT_OR(p.select_permit) AS select_permit, BIT_OR(p.update_permit) AS update_permit, BIT_OR(p.insert_permit) AS insert_permit, BIT_OR(delete_permit) AS delete_permit " +
            "FROM mydb.privilege AS p WHERE p.module_id = (SELECT m.id FROM mydb.module AS m WHERE m.name = ?1) AND p.roles_id IN (SELECT uhr.roles_id FROM mydb.user_has_roles AS uhr " +
            "WHERE uhr.user_id = (SELECT u.id FROM mydb.user AS u WHERE u.username=?2))", nativeQuery = true)
    String getPrivilegeByUserModule(String moduleName, String username);
}
