package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface EventRepository extends JpaRepository<Event,Integer> {

//    Query to get events according to academic year
    @Query(value = "SELECT new Event (e.id,e.name) FROM Event e WHERE e.event_sub_category_id = '1' AND e.id IN (SELECT ayhe.event_id.id FROM AcademicYearHasEvents ayhe WHERE ayhe.academic_year_id.id = :aca_id)")
    List<Event> getEventListByAcaYear(Integer aca_id);

}
