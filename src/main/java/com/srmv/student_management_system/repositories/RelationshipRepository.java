package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Relationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship,Integer> {

}
