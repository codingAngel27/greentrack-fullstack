package com.greentrack.greentrackapi.repository;

import com.greentrack.greentrackapi.entity.Equipment;
import com.greentrack.greentrackapi.entity.EquipmentState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IEquipmentRepository  extends JpaRepository<Equipment, Long> {
    Optional<Equipment> findByName(String name);
    long countByState(EquipmentState state);

    //Listar por tipo o marca
    Page<Equipment> findByTypeContainingIgnoreCase(String type, Pageable pageable);

    Page<Equipment> findByBrandContainingIgnoreCase(String brand, Pageable pageable);

}
