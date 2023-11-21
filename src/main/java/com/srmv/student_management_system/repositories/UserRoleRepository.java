package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRoleRepository extends JpaRepository<UserRole,Integer> {

    @Query(value = "SELECT r FROM UserRole r WHERE r.id IN(SELECT usr.roles_id.id FROM UserHasRoles AS usr WHERE usr.user_id.id = :user_id)")
    List<UserRole> getRoleByUserId(@Param("user_id") Integer user_id);
}
