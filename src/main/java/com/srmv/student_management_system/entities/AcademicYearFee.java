package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "academic_year_fee")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AcademicYearFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "fee")
    private BigDecimal fee;

    @ManyToOne
    @JoinColumn(name = "academic_year_id", referencedColumnName = "id")
    private AcademicYear academic_year_id;

    @ManyToOne
    @JoinColumn(name = "payment_category_id", referencedColumnName = "id")
    private PaymentCategory payment_category_id;


    public AcademicYearFee(BigDecimal fee){
        this.fee = fee;
    }
}
