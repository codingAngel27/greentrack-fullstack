package com.greentrack.greentrackapi.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Data
@Table(name = "equipments", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank
    private String name;

    @Column(nullable = false)
    @NotBlank
    private String type;

    @Column(nullable = false)
    @NotBlank
    private String brand;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EquipmentState state = EquipmentState.DISPONIBLE;
}
