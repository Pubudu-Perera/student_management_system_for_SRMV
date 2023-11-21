package com.srmv.student_management_system.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "student_has_attendance")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceHasStudents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student_id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "attendance_id", referencedColumnName = "id")
    private Attendance attendance_id;

    @Column(name = "attendance_present")
    private Boolean attendancePresent;

}
