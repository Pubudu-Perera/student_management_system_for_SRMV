package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "academic_year")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class AcademicYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "start_date")
    private LocalDate start_date;

    @Column(name = "end_date")
    private LocalDate end_date;

    @Column(name = "added_date")
    private LocalDate added_date;

    @Column(name = "last_update")
    private LocalDateTime last_update;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;

    @ManyToOne
    @JoinColumn(name = "aca_status_id", referencedColumnName = "id")
    private AcademicYearStatus aca_status_id;

    @ManyToOne
    @JoinColumn(name = "added_user", referencedColumnName = "id")
    private User added_user;

    @OneToMany(mappedBy = "academic_year_id", orphanRemoval = true)
    public List<AcademicYearHasEvents>  academicYearHasEventsList;

    public AcademicYear(Integer id, String name){
        this.id = id;
        this.name = name;
    }



}
