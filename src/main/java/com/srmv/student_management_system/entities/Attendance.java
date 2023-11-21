package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "attendance")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "total_students")
    private Integer total_students;

    @Column(name = "present")
    private Integer present;

    @Column(name = "absent")
    private Integer absent;

    @ManyToOne
    @JoinColumn(name = "classroom_id", referencedColumnName = "id")
    private Classroom classroom_id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user_id;

    @OneToMany(mappedBy = "attendance_id", orphanRemoval = true)
    private List<AttendanceHasStudents> attendanceHasStudentsList;

}
