package com.srmv.student_management_system.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "grade")
@Data
@AllArgsConstructor
@NoArgsConstructor

//JSON null values won't be displayed
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private Integer name;

    @ManyToOne
    @JoinColumn(name = "sub_section_id", referencedColumnName = "id")
    private SubSection sub_section_id;

}
