package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

    @Query(value = "SELECT new User(us.id, us.username, us.email, us.user_status, us.employee_id) FROM User us WHERE us.username <> 'admin' ORDER BY us.id DESC")
    List<User> getUserList();

    @Query(value = "SELECT u FROM User AS u WHERE u.username = ?1")
    User findUserByUsername(String username);
}
