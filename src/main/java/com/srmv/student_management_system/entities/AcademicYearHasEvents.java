package com.srmv.student_management_system.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "academic_year_has_event")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AcademicYearHasEvents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "start_date")
    private LocalDate start_date;

    @Column(name = "end_date")
    private LocalDate end_date;

    @ManyToOne
    @JoinColumn(name = "academic_year_id", referencedColumnName = "id")
    @JsonIgnore
    private AcademicYear academic_year_id;

    @ManyToOne
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    private Event event_id;

}
